defmodule Wishlist.Dashboard.LeagueCurrency do
  use Ecto.Schema
  import Ecto.Changeset

  schema "leaguecurrencies" do
    field(:icon, :string)
    field(:lowConfidenceSparkLine, :map)
    field(:name, :string)
    field(:sparkLine, :map)
    field(:chaosValue, :float)

    timestamps()
  end

  @doc false
  def changeset(league_currency, attrs) do
    league_currency
    |> cast(attrs, [:name, :icon, :chaosValue, :sparkLine, :lowConfidenceSparkLine])
    |> validate_required([:name])
  end
end
