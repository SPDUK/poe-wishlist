defmodule WishlistWeb.LeagueCurrencyController do
  use WishlistWeb, :controller
  plug(:put_view, WishlistWeb.CurrencyView)
  alias Wishlist.Dashboard
  alias Wishlist.Dashboard.LeagueCurrency

  def index(conn, _params) do
    currencies = Dashboard.list_all_currency(LeagueCurrency)
    render(conn, "index.json", currencies: currencies)
  end
end
