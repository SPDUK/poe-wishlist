defmodule Wishlist.Repo.Migrations.CreateLeaguecurrencies do
  use Ecto.Migration

  def change do
    create table(:leaguecurrencies) do
      add(:name, :string)
      add(:icon, :string)
      add(:chaosValue, :float)
      add(:sparkLine, :map)
      add(:lowConfidenceSparkLine, :map)

      timestamps()
    end
  end
end
