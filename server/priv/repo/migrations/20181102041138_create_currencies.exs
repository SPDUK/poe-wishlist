defmodule Wishlist.Repo.Migrations.CreateCurrencies do
  use Ecto.Migration

  def change do
    create table(:currencies) do
      add :name, :string
      add :icon, :string
      add :chaosValue, :float
      add :sparkLine, :map
      add :lowConfidenceSparkLine, :map

      timestamps()
    end

  end
end
