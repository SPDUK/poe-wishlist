defmodule Wishlist.Dashboard.HcCurrency do
  use Ecto.Schema
  import Ecto.Changeset

  schema "hccurrencies" do
    field(:icon, :string)
    field(:lowConfidenceSparkLine, :map)
    field(:name, :string)
    field(:sparkLine, :map)
    field(:chaosValue, :float)

    timestamps()
  end

  @doc false
  def changeset(hc_currency, attrs) do
    hc_currency
    |> cast(attrs, [:name, :icon, :chaosValue, :sparkLine, :lowConfidenceSparkLine])
    |> validate_required([:name])
  end
end
