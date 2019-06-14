defmodule Wishlist.Repo.Migrations.CreateHccurrencies do
  use Ecto.Migration

  def change do
    create table(:hccurrencies) do
      add(:name, :string)
      add(:icon, :string)
      add(:chaosValue, :float)
      add(:sparkLine, :map)
      add(:lowConfidenceSparkLine, :map)

      timestamps()
    end
  end
end
