defmodule Wishlist.Repo.Migrations.CreateHcleagueitems do
  use Ecto.Migration

  def change do
    create table(:hcleagueitems) do
      add :api_id, :integer
      add :name, :string
      add :chaosValue, :float
      add :icon, :text
      add :variant, :string
      add :levelRequired, :integer
      add :links, :integer
      add :itemClass, :integer
      add :itemType, :string
      add :implicitModifiers, :map
      add :explicitModifiers, :map
      add :flavourText, :text
      add :sparkline, :map
      add :lowConfidenceSparkline, :map

      timestamps()
    end

  end
end
