defmodule Wishlist.Repo.Migrations.CreateHcleaguecurrencies do
  use Ecto.Migration

  def change do
    create table(:hcleaguecurrencies) do
      add(:name, :string)
      add(:icon, :string)
      add(:chaosValue, :float)
      add(:sparkLine, :map)
      add(:lowConfidenceSparkLine, :map)

      timestamps()
    end
  end
end
