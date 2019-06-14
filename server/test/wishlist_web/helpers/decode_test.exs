defmodule DecodeTest do
  use ExUnit.Case, async: true
  alias WishlistWeb.Decode
  doctest WishlistWeb.Decode

  test "Key should be gcARAQ7x when ending with /" do
    assert Decode.get_key("https://pastebin.com/gcARAQ7x/") == "gcARAQ7x"
  end

  test "Key should be gcARAQ7x when NOT ending with /" do
    assert Decode.get_key("https://pastebin.com/gcARAQ7x") == "gcARAQ7x"
  end

  test "Key should be h2vsQFS0 when using a raw link when ending with /" do
    assert Decode.get_key("https://pastebin.com/raw/h2vsQFS0/") == "h2vsQFS0"
  end

  test "Key should be h2vsQFS0 when using a raw link NOT ending with /" do
    assert Decode.get_key("https://pastebin.com/raw/h2vsQFS0") == "h2vsQFS0"
  end

  test "build_item should return a name and nil variant for an unimportant variant" do
    item =
      Decode.build_item([
        "Rarity: UNIQUE",
        "Agnerod West",
        "Imperial Staff",
        "Variant: Pre 2.6.0",
        "Variant: Current",
        "Selected Variant: 2",
        "Quality: 20",
        "LevelReq: 66",
        "Implicits: 2",
        "{variant:1}12% Chance to Block",
        "{variant:2}18% Chance to Block",
        "{variant:1}+1 to Level of Socketed Lightning Gems",
        "{variant:2}+2 to Level of Socketed Lightning Gems",
        "{range:0.5}+(80-120) to Intelligence",
        "{range:0.5}(30-50)% increased Lightning Damage",
        "{range:0.5}Adds (5-15) to (100-140) Lightning Damage to Spells",
        "40% increased Strength Requirement"
      ])

    assert item == %{
             :name => "Agnerod West",
             :variant => nil,
             :custom => false,
             :rarity => "unique"
           }
  end

  test " should NOT return nil variant where they have no original variant" do
    item =
      Decode.build_item([
        "Rarity: UNIQUE",
        "Agnerod West",
        "Imperial Staff",
        "Quality: 20",
        "Sockets: B-B-B-B-B-B",
        "LevelReq: 66",
        "Implicits: 2",
        "{variant:1}12% Chance to Block",
        "{variant:2}18% Chance to Block",
        "Damage Penetrates 20% Lightning Resistance"
      ])

    assert item == %{
             :name => "Agnerod West",
             :variant => nil,
             :custom => false,
             :rarity => "unique"
           }
  end

  test "should return a variant" do
    item =
      Decode.build_item([
        "Rarity: UNIQUE",
        "Agnerod West",
        "Imperial Staff",
        "Variant: Lightning Staff",
        "Variant: Current",
        "Selected Variant: 1",
        "Quality: 20",
        "Sockets: B-B-B-B-B-B",
        "LevelReq: 66",
        "Implicits: 2",
        "{variant:1}12% Chance to Block",
        "{variant:2}18% Chance to Block",
        "Damage Penetrates 20% Lightning Resistance"
      ])

    assert item == %{
             :name => "Agnerod West",
             :variant => "Lightning Staff",
             :custom => false,
             :rarity => "unique"
           }
  end

  # // tests for getting things from XML
  test "get_xml should return a list of item names and variants where they have no original variant" do
    items = Decode.get_xml("https://pastebin.com/MtEJ0T2e")

    assert items == [
             %{
               :name => "Architect's Hand",
               :variant => nil,
               :custom => false,
               :rarity => "unique"
             },
             %{
               :name => "Anatomical Knowledge",
               :variant => nil,
               :custom => false,
               :rarity => "unique"
             },
             %{
               :name => "Architect's Hand",
               :variant => nil,
               :custom => false,
               :rarity => "unique"
             },
             %{
               :name => "Vessel of Vinktar",
               :variant => "Pre 2.2.0 (Penetration)",
               :custom => false,
               :rarity => "unique"
             },
             %{:name => "Apparitions", :variant => nil, :custom => false, :rarity => "unique"}
           ]
  end

  test "get_xml should return a correct list of item names and variants" do
    items = Decode.get_xml("https://pastebin.com/Ae9yV494")

    assert items == [
             %{:name => "Windripper", :variant => nil, :custom => false, :rarity => "unique"},
             %{
               :name => "Lochtonial Caress",
               :variant => nil,
               :custom => false,
               :rarity => "unique"
             },
             %{
               :name => "Yriel's Fostering",
               :variant => "Ursa",
               :custom => false,
               :rarity => "unique"
             }
           ]
  end

  # // 4 windrippers in a build, each with a different "variant" (2.0, 2.6, 3.0, current) should all return undefined
  test "get_xml with unimportant information should return undefined variants" do
    items = Decode.get_xml("https://pastebin.com/HaY1tbKN")

    assert items == [
             %{:name => "Windripper", :variant => nil, :custom => false, :rarity => "unique"},
             %{:name => "Windripper", :variant => nil, :custom => false, :rarity => "unique"},
             %{:name => "Windripper", :variant => nil, :custom => false, :rarity => "unique"},
             %{:name => "Windripper", :variant => nil, :custom => false, :rarity => "unique"}
           ]
  end

  # different variants of talismans, one handed swords, jewels, flasks should all be the same, pastebin includes 1 of each base
  test "each item base should return the correct item base when decoding" do
    items = Decode.get_xml("https://pastebin.com/FpN7YaUx")
    IO.inspect(Enum.at(items, 0))
    assert Enum.at(items, 0).itemType == "weapon.bow"
    assert Enum.at(items, 1).itemType == "weapon.onemace"
    assert Enum.at(items, 2).itemType == "weapon.oneaxe"
    assert Enum.at(items, 3).itemType == "weapon.twomace"
    assert Enum.at(items, 4).itemType == "weapon.staff"
    assert Enum.at(items, 5).itemType == "weapon.twosword"
    assert Enum.at(items, 6).itemType == "weapon.twoaxe"
    # regular sword
    assert Enum.at(items, 7).itemType == "weapon.onesword"
    assert Enum.at(items, 8).itemType == "weapon.wand"
    assert Enum.at(items, 9).itemType == "weapon.dagger"
    # thrusting sword
    assert Enum.at(items, 10).itemType == "weapon.onesword"
    assert Enum.at(items, 11).itemType == "weapon.claw"
    assert Enum.at(items, 12).itemType == "weapon.sceptre"
    assert Enum.at(items, 13).itemType == "armour.quiver"
    assert Enum.at(items, 14).itemType == "armour.shield"
    assert Enum.at(items, 15).itemType == "armour.helmet"
    assert Enum.at(items, 16).itemType == "armour.chest"
    assert Enum.at(items, 17).itemType == "armour.gloves"
    assert Enum.at(items, 18).itemType == "armour.boots"
    # talisman amulet
    assert Enum.at(items, 19).itemType == "accessory.amulet"
    # normal amulet
    assert Enum.at(items, 20).itemType == "accessory.amulet"
    assert Enum.at(items, 21).itemType == "accessory.ring"
    assert Enum.at(items, 22).itemType == "accessory.belt"
    assert Enum.at(items, 23).itemType == "flask"

    # normal jewel
    assert Enum.at(items, 24).itemType == "jewel"
    # abyss jewel
    assert Enum.at(items, 25).itemType == "jewel"
  end
end
