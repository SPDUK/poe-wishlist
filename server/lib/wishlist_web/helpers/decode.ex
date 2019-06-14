defmodule WishlistWeb.Decode do
  import SweetXml

  @doc """
   Removes the trailing / from a pastebin link and returns the key
  """
  def get_key(url) do
    String.split(url, "/", trim: true)
    |> List.last()
  end

  @doc """
    Turns a path of building base64 decoded buffer into XML
  """
  def decode_and_inflate(b64) do
    z = :zlib.open()
    :zlib.inflateInit(z)
    uncompressed = :zlib.inflate(z, b64)
    :zlib.close(z)
    List.to_string(uncompressed)
  end

  @doc """
    Removes useless variants from Path of Building variants
    ## Examples
        iex> WishlistWeb.Decode.get_item_variant("Variant: Pre 2.6.0")
        nil

        iex> WishlistWeb.Decode.get_item_variant("Variant: Chaos")
        "Chaos"
  """
  def get_item_variant(str) do
    case String.slice(str, 9..-1) do
      "Current" -> nil
      "Pre 3.0.0" -> nil
      "Pre 2.6.0" -> nil
      "Pre 2.0.0" -> nil
      str -> str
    end
  end

  @doc """
    look in each list in the JSON file, if the item base exists in that list then use the key to that list as the base,
    eg if "Jet Amulet" is in "accessory.amulet": list, return "accessory.amulet", else return the type parameter.
    returns: %{"icon" => icon, "item_type" => item_type, "name" => _}
  """
  def get_item_info(type) do
    bases =
      File.read!(Path.expand("./bases.json", __DIR__))
      |> Poison.decode!()

    # loop through each item base, check if the name is in that list, if it is set the icon and name
    # return a map to destructure the item_name and icon from

    Enum.find(bases, fn base ->
      String.contains?(type, base["name"])
    end)
  end

  @doc """
    Gets the name and variant from the item, returning a map with the correct name and variant
  """
  def build_item(item) do
    rarity =
      Enum.at(item, 0)
      |> String.split(":")
      |> List.last()
      |> String.downcase()
      |> String.trim()

    name = Enum.at(item, 1)
    item_type = Enum.at(item, 2)

    # have to split this into 2 seperate reassignment statements, as we could change to the item name, not the item_type for some items, in which case we want to check
    # the second cond statement to see if the name contains any of those, if it does we reassign the item_type again
    item_type =
      if String.starts_with?(item_type, "Unique ID") ||
           String.starts_with?(item_type, "Crafted: true") do
        # if the item_type isn't useful use the item's name
        name
      else
        item_type
      end

    # gets the item type from the list of bases, eg turns "Clasped Boots" into "armour.boots"
    %{"icon" => icon, "item_type" => item_type, "name" => _} = get_item_info(item_type)

    # if the item is still not found we assume it's one of the awkward/broken types and replace flasks, rings, and jewels
    # find index of the implicit line, then get the amount of implicit mods (next lines)
    # get the remainder of the list after the implicits, and the implicits
    implicit_index = Enum.find_index(item, fn e -> String.match?(e, ~r/Implicits/) end)

    # if there is no implicit index, change it to 0
    implicit_index =
      if implicit_index == nil do
        0
      else
        implicit_index
      end

    # get the amount of implicit items that are in the list (number is at the end of a string.)
    implicit_count =
      if implicit_index > 0 do
        Enum.at(item, implicit_index)
        |> String.last()
        |> String.to_integer()
      else
        0
      end

    # get the implicit mods from the list
    implicits = Enum.slice(item, implicit_index + 1, implicit_count)

    # calculates the amount of indexes are in the list, so we slice from after the amount of implicit items for explicit items
    implicit_amount = implicit_index + 1 + implicit_count

    # get the explicit item mods
    explicits = Enum.slice(item, implicit_amount, Kernel.length(item))
    # check if one is corrupted, if it is then add corrupted to map
    corrupted = Enum.find_value(explicits, fn e -> String.match?(e, ~r/Corrupted/) end)

    # filter out the corrupted and crafted mods from explicits
    explicits =
      explicits
      |> Enum.filter(fn e -> e != "Corrupted" end)

    variants = Enum.filter(item, fn e -> String.slice(e, 0, 8) == "Variant:" end)

    # if the item has variants, create a variant, else return nil as the variant value for the final map
    variant =
      if Kernel.length(variants) > 0 do
        variant_index =
          case Enum.filter(item, fn e -> String.contains?(e, "Selected Variant:") end) do
            [] ->
              0

            list ->
              list
              |> List.to_string()
              |> String.last()
              |> String.to_integer()
              |> Kernel.-(1)
          end

        Enum.at(variants, variant_index)
        |> get_item_variant()
      else
        nil
      end

    if rarity == "unique" do
      %{:name => name, :variant => variant, :rarity => rarity, :custom => false}
    else
      %{
        :variant => variant,
        :explicitModifiers => explicits,
        :implicitModifiers => implicits,
        :name => name,
        :rarity => rarity,
        :corrupted => corrupted,
        :id => 0,
        :chaosValue => 0,
        :itemClass => 3,
        :api_id => 0,
        :icon => icon,
        :itemType => item_type,
        :flavourText => "",
        :links => 0,
        :levelRequired => 0,
        :sparkline => nil,
        :lowConfidenceSparkline => nil,
        :custom => true
      }
    end
  end

  @doc """
    The starting point for creating item info for the end list
    Gets the info out of the XML and maps over it, trimming out all the new lines and spacing, then maps over the new data that only has info,
    returning a list of item maps ex  [%{"name" => "item 1", "variant" => "variant"}, %{"name" => "item 2", "variant" => nil} ]
  """
  def get_items_info(xml) do
    build_items =
      xml
      |> xmap(
        build: [
          ~x[//PathOfBuilding/Items],
          items: ~x[./Item/text()]l
        ]
      )

    items =
      build_items[:build][:items]
      |> Enum.map(fn e ->
        List.to_string(e)
        |> String.replace("\t", "")
        |> String.split("\n", trim: true)
      end)
      |> Enum.reject(fn e -> e == [] end)

    Enum.map(items, fn e -> build_item(e) end)
  end

  @doc """
    The start point for the pipeline of creating a build from a path of building pastebin url, takes in a url and decodes it from base64 to a buffer,
    then turns that buffer into XML, finally turns that XML into multiple lists and eventually returns a list of maps that each have a name and variant
  """
  def get_xml(url) do
    key = get_key(url)
    url = "https://pastebin.com/raw/#{key}"

    HTTPoison.start()
    response = HTTPoison.get!(url)

    Base.url_decode64!(response.body)
    |> decode_and_inflate
    |> get_items_info()
  end
end
