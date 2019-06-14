import mods from '../../../json/mods.json';
import flasks from '../../../json/flasks.json';
const possible6Links = ['Two Handed Sword', 'Two Handed Axe', 'Two Handed Mace', 'Staff', 'Bow', 'Body Armour'];

// name is a fixedName IE a mod name that includes a # instead of a number
const getValue = (name, mod) => {
  // check if the fixed name includes # to #, if it does we know we can find the before and after numbers
  // if a mod includes (222- 333) to (888-999) it will find the middle value of those, also works for (222) to (999) or 222 to 999
  if (name.includes('# to #')) {
    const idx = mod.indexOf('to');
    const firstHalf = parseInt(mod.slice(idx - 5, idx).replace(/\D/g, ''));
    const secondHalf = parseInt(mod.slice(idx + 2, idx + 7).replace(/\D/g, ''));
    return Math.floor((firstHalf + secondHalf) / 2);
  }

  // for items with a range, we remove the range part of the mod and the first bracket, look at the first value eg 23-40) and get 23 from it
  if (mod.startsWith('{range:')) {
    mod = mod.replace(/\{.*?\}/, '');
    // find where the brackets are for the number in the string -- eg adds +(25-50) to physical damage
    const idx = mod.indexOf('(') + 1;
    const endIdx = mod.indexOf(')');

    // gets the 2 numbers to an array, then calculate the middle between them
    const nums = mod.slice(idx, endIdx).split('-');
    return Math.floor((parseInt(nums[0]) + parseInt(nums[1])) / 2);
  }

  let rest;
  const index = name.indexOf('#');
  if (mod[name.indexOf('#') - 1] === '-') {
    rest = mod.slice(index - 1);
  } else rest = mod.slice(index);

  let values = '';
  if (rest.startsWith('-')) values = '-';
  for (let char of rest) {
    if (char === '+') continue;
    if (char === '-') continue;
    if (char.match(/[0-9]/)) values += char;
    else break;
  }

  return values ? parseInt(values) : 0;
};

const fixModNames = str => {
  if (str.startsWith('{range:') || str.startsWith('{crafted}')) str = str.replace(/{.*}/, '');
  let replacedCount = 0;
  let lastChar = '';
  // if the current char matches a number, check the replacedCount, if we have replaced more than 2 SETS of numbers, just return the number
  // if the last char is a number, we take it out of the string so 185 will turn to #, because the first char is turned to a # and the last char for the following numbers was a number, so we just reutrn an empty string
  // we can only replace up to 2 sets of strings as (most..) mods are either # to # or just #, so we don't replace
  const replacedStr = str
    .replace('.', '')
    .replace(/\{.*?\}/, '')
    .split('')
    .map(s => {
      if (s.match(/[0-9]/)) {
        if (replacedCount > 2) return s;
        if (typeof lastChar === 'number') return '';
        lastChar = parseInt(s);
        replacedCount++;
        return '#';
      }
      lastChar = s;
      return s;
    })
    .join('');

  // if the string has a range eg adds (230-239) to (320-360) damage, replace those numbers and brackets with a #
  if (replacedStr.includes(') to (')) {
    return replacedStr.replace(/\(.*?\)/, '#').replace(/\(.*?\)/, '#');
  }
  // replace the first instance of brackets occuring for weird POB links
  if (replacedStr.startsWith('(#-')) {
    return replacedStr.replace(/ *\([^)]*\) */, '#');
  }
  // fixes rings and other things that are awkwardly placed after a {range} modifier, not sure if needed or optimal, but it catches random niche cases, sometimes.
  if (replacedStr.startsWith('+(#-#)')) {
    const idx = replacedStr.lastIndexOf('#');
    const newStr = replacedStr.slice(idx + 2);
    return `#${newStr}`;
  }
  return replacedStr;
};

const queryBuilder = (item, league) => {
  if (item.url && item.url.length > 8) return item.url;
  const url = `https://pathofexile.com/api/trade/search/${league}?redirect&source=`;
  const q = {
    query: {
      filters: {
        type_filters: {
          filters: {}
        }
      }
    }
  };

  // add the item name in to the search bar if it's a unique item
  if (item.itemType === 'flask' && item.custom) {
    for (const flask of flasks) {
      // if the flask is a normal flask use the default name as a search because custom name searching is broken, searching for a full flask name doesn't work
      if (item.name === flask) q.query.filters.type_filters.filters.rarity = { option: 'normal' };
      // if the item is not equal to a flask but that flask is included in the list of flasks eg: "Divine Life Flask" is included in "Divine Life Flask of Staunching"
      else {
        if (item.name.includes(flask)) {
          // search for a flask where the rarity option is magic, using the name of the flask (the base item flask),  using the mods in the item it will find the correct base item with those mods
          q.query.type = flask;
          q.query.filters.type_filters.filters.rarity = { option: 'magic' };
        }
      }
    }
  }
  if (!item.custom && item.itemClass !== 5 && item.itemClass !== 6) {
    q.query.name = item.name;
  }

  // if the item can have more than 4 links then link to whichever variant the user saved (0/5/6), only for items with links
  if (item.links) {
    if (possible6Links.includes(item.itemType)) {
      q.query.filters.socket_filters = {
        filters: { links: { min: item.links, max: item.links } }
      };
    }
  }
  if (item.custom) {
    const modGen = type => {
      return item[`${type}Modifiers`]
        .map(itemMod => {
          let fixedName = fixModNames(itemMod).trim();
          let fixedPOBName = fixedName.replace('+', '');
          let fixedReducedName = fixedPOBName.replace('reduced', 'increased');
          // use a list of names to find which ones work, as a last resort we look to see if the mod exists with a swapped increased/reduced value
          const names = [fixedName, fixedPOBName, fixedReducedName];

          // if the mod is an echnated item, look to find it
          if (type === 'implicit' && itemMod.startsWith('{crafted}')) {
            if (fixedName.includes('reduced')) {
              if (mods['enchant'][fixedReducedName]) {
                return { id: mods['enchant'][fixedReducedName] };
              }
            }
            if (mods['enchant'][fixedName]) {
              return { id: mods['enchant'][fixedName] };
            }
          }

          // if the item is crafted with an explicit mod, try to find it - else it will most likely be found by a pseudo mod
          if (type === 'explicit' && itemMod.startsWith('{crafted}')) {
            if (fixedName.startsWith('{range:')) {
              fixedName = fixedName.replace(/\{.*?\}/g);
            }

            if (fixedName.includes('reduced')) {
              return { id: mods['crafted'][fixedReducedName] };
            }
            if (mods['crafted'][fixedName]) {
              return { id: mods['crafted'][fixedName] };
            }
          }

          let foundItem = {};
          for (const name of names) {
            if (mods['pseudo'][name]) {
              const itemValue = getValue(name, itemMod);
              foundItem.id = mods['pseudo'][name];
              // don't set a value if the item is a reduced/increased value, it will break as it doesn't work always with negative/positive values, only on a case by case basis which is hard to figure out
              if (itemMod.includes('reduced')) break;
              foundItem.value = { min: itemValue };
              break;
            } else {
              if (mods[type][name]) {
                const itemValue = getValue(name, itemMod);
                foundItem.id = mods[type][name];
                if (itemMod.includes('reduced')) break;
                foundItem.value = { min: itemValue };
                break;
              }
            }
          }
          // if (foundItem === {}) {
          //   console.log('---------------no item found for that item mod----------------');
          //   console.log(foundItem);
          //   console.log(item);
          //   console.log('----this may appear for flasks even if they work properly----');
          // }
          return Object.keys(foundItem).length ? foundItem : undefined;
        })
        .filter(e => e !== undefined);
    };
    // // loop over implicit and explicit modifiers
    // look for pseudo mods of both types, if they exist take them out of the implicit or explicit mods; - then push to pseudo array with psuedo mods
    // if no peusdo mods just find implicit or explicit mods
    let psuedoMods = [];
    let implicitMods = [];

    if (item.implicitModifiers.length) {
      implicitMods = modGen('implicit');
    }
    let explicitMods = [];
    if (item.explicitModifiers.length) {
      explicitMods = modGen('explicit');
    }

    // if (
    //   item.implicitModifiers.length + item.explicitModifiers.length !==
    //     implicitMods.length + explicitMods.length + psuedoMods.length &&
    //   item.itemType !== 'flask'
    // ) {
    //   console.log('*********************');
    //   console.log('ERROR WITH ITEM: ' + item.name);
    //   console.log('implicits:');
    //   console.log(item.implicitModifiers);
    //   console.log(implicitMods);
    //   console.log('explicits:');
    //   console.log(item.explicitModifiers);
    //   console.log(explicitMods);
    //   console.log(psuedoMods);
    //   console.log('*** this may appear for flasks even if they work properly ***');
    // }

    // TODO: figure out why e.id can be undefined?
    // loops over and finds repeats, if a mod is repeated twice (pseudo is found twice for example) it will add to the value instead of showing the
    const allMods = [...implicitMods, ...explicitMods, ...psuedoMods].filter(e => e.id !== undefined);
    // if (!allMods.length) {
    //   console.log('NO MODS FOR', item.name);
    //   console.log(item);
    //   console.log(allMods);
    //   console.log('++++++++++++++++++++');
    // }
    const uniqMods = {};
    allMods.forEach(e => {
      if (uniqMods[e.id]) uniqMods[e.id].value.min += e.value.min;
      else uniqMods[e.id] = e;
    });
    const allFixedMods = Object.values(uniqMods);

    q.query.stats = [
      {
        type: 'and',
        filters: allFixedMods
      }
    ];

    // because some crafted flasks from PoB come through as 'Crafted: true' instead of giving a useful item base.
    if (item.itemType !== 'Crafted: true') {
      q.query.filters.type_filters.filters.category = { option: item.itemType };
    }
  }
  // if the item is an essence remove the name (causes error) and add keys for essence search
  if (item.itemClass === 5) {
    q.query.type = item.name;
  }
  // if the item is a card remove the name (causes error) and instead add category of card, add keys for card search
  if (item.itemClass === 6) {
    q.query.filters.type_filters.category = { option: 'card' };
    q.query.type = item.name;
  }
  // if the item is a foil then link to the foil version instead
  if (item.itemClass === 9) {
    q.query.filters.type_filters.filters.rarity = { option: 'uniquefoil' };
  }
  // concat the query as a string to the end of the url so it finds the correct item
  return url + JSON.stringify(q);
};

export default queryBuilder;
