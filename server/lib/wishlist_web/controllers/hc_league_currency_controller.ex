defmodule WishlistWeb.HcLeagueCurrencyController do
  use WishlistWeb, :controller
  plug(:put_view, WishlistWeb.CurrencyView)
  alias Wishlist.Dashboard
  alias Wishlist.Dashboard.HcLeagueCurrency

  def index(conn, _params) do
    currencies = Dashboard.list_all_currency(HcLeagueCurrency)
    render(conn, "index.json", currencies: currencies)
  end
end
