defmodule WishlistWeb.ItemView do
  use WishlistWeb, :view
  alias WishlistWeb.ItemView

  def render("index.json", %{items: items}) do
    render_many(items, ItemView, "item.json")
  end

  def render("show.json", %{item: item}) do
    render_one(item, ItemView, "item.json")
  end

  def render("names.json", %{items: items}) do
    render_many(items, ItemView, "names.json")
  end

  def render("item.json", %{item: item}) do
    %{
      id: item.id,
      api_id: item.api_id,
      name: item.name,
      chaosValue: item.chaosValue,
      icon: item.icon,
      variant: item.variant,
      levelRequired: item.levelRequired,
      links: item.links,
      itemClass: item.itemClass,
      itemType: item.itemType,
      implicitModifiers: item.implicitModifiers,
      explicitModifiers: item.explicitModifiers,
      flavourText: item.flavourText,
      sparkline: item.sparkline,
      lowConfidenceSparkline: item.lowConfidenceSparkline,
      custom: item.custom,
    }
  end

  def render("names.json", %{item: item}) do
    %{name: item.name}
  end

  def render("version.json", %{version: version}) do
    %{version: version}
  end
end
