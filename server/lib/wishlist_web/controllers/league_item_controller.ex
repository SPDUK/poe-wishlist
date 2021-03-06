defmodule WishlistWeb.LeagueItemController do
  use WishlistWeb, :controller
  plug(:put_view, WishlistWeb.ItemView)
  alias Wishlist.Dashboard
  alias Wishlist.Dashboard.LeagueItem

  action_fallback(WishlistWeb.FallbackController)

  def build(conn, %{"ids" => ids}) do
    if is_list(ids) do
      items = Dashboard.list_build_items(LeagueItem, ids)

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
      conn
      |> put_status(:not_found)
      |> render(WishlistWeb.ErrorView, "404.json", message: "Invalid list of IDs")
    end
  end

  def index(conn, _params) do
    items = Dashboard.list_all_items(LeagueItem)
    render(conn, "index.json", items: items)
  end

  def find_by_name(conn, %{"name" => name}) do
    items = Dashboard.list_by_name(LeagueItem, name)
    render(conn, "index.json", items: items)
  end

  def list_names(conn, _params) do
    items = Dashboard.list_all_names(LeagueItem)
    render(conn, "names.json", items: items)
  end

  def pob(conn, %{"url" => url}) do
    items = Dashboard.list_pob_items(LeagueItem, url)
    render(conn, "index.json", items: items)
  end
end
