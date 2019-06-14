defmodule Wishlist.Dashboard do
  @moduledoc """
  The Dashboard context.
  """

  import Ecto.Query, warn: false
  alias Wishlist.Repo

  @doc """
  Lists all items that are in a list of ids
  """
  def list_build_items(schema, ids) do
    from(i in schema,
      where: i.id in ^ids,
      order_by: [desc: i.chaosValue]
    )
    |> Repo.all()
  end

  @doc """
  Lists all items where the name matches the passed in name
  """
  def list_by_name(schema, name) do
    from(i in schema,
      where: i.name == ^name,
      order_by: [desc: i.chaosValue]
    )
    |> Repo.all()
  end

  def list_all_items(schema) do
    Repo.all(schema)
  end

  @doc """
  Lists all distinct (unique) names to be used by the search bar
  """
  def list_all_names(schema) do
    from(i in schema,
      distinct: i.name,
      order_by: [i.name],
      select: %{name: i.name}
    )
    |> Repo.all()
  end

  def list_items(schema) do
    Repo.all(schema)
  end

  def list_all_currency(schema) do
    from(c in schema, order_by: [desc: c.chaosValue])
    |> Repo.all()
  end

  @doc """
  Lists all items from a Path Of Building pastebin url, Decode.xml decodes into a list of maps that have a variant and a name,
  this function tries to find where the variant if one is passed in, else it will just return the item with the highest amount of links (builds usually will have a 6 linked item, and no amount of links is given by the pastebin, so we assume they want one with the highest amount of links)

  Eventually at the end we filter out all nil or duplicates and sort by chaosValue and return those items
  """
  def list_pob_items(schema, url) do
    items =
      WishlistWeb.Decode.get_xml(url)
      |> Enum.map(fn
        item ->
          case item.rarity do
            "unique" ->
              case item.variant do
                nil ->
                  from(i in schema,
                    where: i.name == ^item.name,
                    order_by: [desc: i.links]
                  )
                  |> first
                  |> Repo.one()

                variant ->
                  from(i in schema,
                    where: i.name == ^item.name and ilike(i.variant, ^variant),
                    order_by: [desc: i.links]
                  )
                  |> first
                  |> Repo.one()
              end

            _other ->
              item
          end
      end)

    # remove all nil items that could not be found in the selected schema (not all items will be in all leagues), sort them by value as I'm not sure how to it in one query
    Enum.filter(items, fn e -> e !== nil end)
    |> Enum.uniq()
    |> Enum.sort(fn a, b -> a.chaosValue > b.chaosValue end)
  end
end
