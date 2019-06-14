defmodule WishlistWeb.ItemController do
  use WishlistWeb, :controller
  plug(:put_view, WishlistWeb.ItemView)
  alias Wishlist.Dashboard
  alias Wishlist.Dashboard.Item

  action_fallback(WishlistWeb.FallbackController)

  def build(conn, %{"ids" => ids}) do
    if is_list(ids) do
      items = Dashboard.list_build_items(Item, ids)

      if items do
        render(conn, "index.json", items: items)
      else
        conn
        |> put_status(:not_found)
        |> render(WishlistWeb.ErrorView, "404.json",
          message: "There was an error fetching build items"
        )
      end
    else
      # Poison.decode will return an error rather than decoding an empty array, so just return a successfull connection but with an empty list of items
      render(conn, "index.json", items: [])
    end
  end

  def index(conn, _params) do
    items = Dashboard.list_all_items(Item)
    render(conn, "index.json", items: items)
  end

  def find_by_name(conn, %{"name" => name}) do
    items = Dashboard.list_by_name(Item, name)
    render(conn, "index.json", items: items)
  end

  def list_names(conn, _params) do
    items = Dashboard.list_all_names(Item)
    render(conn, "names.json", items: items)
  end

  def pob(conn, %{"url" => url}) do
    items = Dashboard.list_pob_items(Item, url)
    render(conn, "index.json", items: items)
  end

  def version(conn, _params) do
    version = 0.11
    render(conn, "version.json", version: version)
  end
end
