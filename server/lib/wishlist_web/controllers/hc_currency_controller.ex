defmodule WishlistWeb.HcCurrencyController do
  use WishlistWeb, :controller
  plug(:put_view, WishlistWeb.CurrencyView)
  alias Wishlist.Dashboard
  alias Wishlist.Dashboard.HcCurrency

  def index(conn, _params) do
    currencies = Dashboard.list_all_currency(HcCurrency)
    render(conn, "index.json", currencies: currencies)
  end
end
