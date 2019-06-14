defmodule Wishlist.Dashboard.HcLeagueCurrency do
  use Ecto.Schema
  import Ecto.Changeset

  schema "hcleaguecurrencies" do
    field(:icon, :string)
    field(:lowConfidenceSparkLine, :map)
    field(:name, :string)
    field(:sparkLine, :map)
    field(:chaosValue, :float)

    timestamps()
  end

  @doc false
  def changeset(hc_league_currency, attrs) do
    hc_league_currency
    |> cast(attrs, [:name, :icon, :chaosValue, :sparkLine, :lowConfidenceSparkLine])
    |> validate_required([:name])
  end
end
