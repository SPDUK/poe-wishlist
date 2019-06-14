defmodule WishlistWeb.CurrencyView do
  use WishlistWeb, :view
  alias WishlistWeb.CurrencyView

  def render("index.json", %{currencies: currencies}) do
    render_many(currencies, CurrencyView, "currency.json")
  end

  def render("currency.json", %{currency: currency}) do
    %{
      name: currency.name,
      icon: currency.icon,
      chaosValue: currency.chaosValue,
      sparkLine: currency.sparkLine,
      lowConfidenceSparkLine: currency.lowConfidenceSparkLine
    }
  end
end
