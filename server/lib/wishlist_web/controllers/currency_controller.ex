defmodule WishlistWeb.CurrencyController do
  use WishlistWeb, :controller
  plug(:put_view, WishlistWeb.CurrencyView)
  alias Wishlist.Dashboard
  alias Wishlist.Dashboard.Currency

  def index(conn, _params) do
    currencies = Dashboard.list_all_currency(Currency)
    render(conn, "index.json", currencies: currencies)
  end
end
