defmodule Wishlist.Dashboard.Currency do
  use Ecto.Schema
  import Ecto.Changeset

  schema "currencies" do
    field(:icon, :string)
    field(:lowConfidenceSparkLine, :map)
    field(:name, :string)
    field(:sparkLine, :map)
    field(:chaosValue, :float)

    timestamps()
  end

  @doc false
  def changeset(currency, attrs) do
    currency
    |> cast(attrs, [:name, :icon, :chaosValue, :sparkLine, :lowConfidenceSparkLine])
    |> validate_required([:name])
  end
end
