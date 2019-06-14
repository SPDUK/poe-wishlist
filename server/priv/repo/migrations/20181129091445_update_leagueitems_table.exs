defmodule Wishlist.Repo.Migrations.UpdateLeagueitemsTable do
  use Ecto.Migration

  def change do
    alter table(:leagueitems) do
      add(:custom, :boolean, default: false)
      add(:crafted, :boolean, default: false)
    end
  end
end
