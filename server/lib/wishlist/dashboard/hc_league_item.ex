defmodule Wishlist.Dashboard.HcLeagueItem do
  use Ecto.Schema
  import Ecto.Changeset

  schema "hcleagueitems" do
    field(:api_id, :integer)
    field(:chaosValue, :float)
    field(:flavourText, :string)
    field(:icon, :string)
    field(:itemClass, :integer)
    field(:itemType, :string)
    field(:levelRequired, :integer)
    field(:links, :integer)
    field(:explicitModifiers, {:array, :map})
    field(:implicitModifiers, {:array, :map})
    field(:lowConfidenceSparkline, :map)
    field(:name, :string)
    field(:sparkline, :map)
    field(:variant, :string)
    field(:custom, :boolean)

    timestamps()
  end

  @doc false
  def changeset(hc_league_item, attrs) do
    hc_league_item
    |> cast(attrs, [
      :api_id,
      :name,
      :chaosValue,
      :icon,
      :variant,
      :levelRequired,
      :links,
      :itemClass,
      :itemType,
      :implicitModifiers,
      :explicitModifiers,
      :flavourText,
      :sparkline,
      :lowConfidenceSparkline,
      :custom
    ])
    |> validate_required([
      :api_id,
      :name,
      :chaosValue,
      :icon,
      :links
    ])
  end
end
