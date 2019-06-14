defmodule Wishlist.Repo.Migrations.UpdateLeagueitemsTableCrafts do
  use Ecto.Migration

  def change do
    alter table(:leagueitems) do
      remove(:crafted)
    end
  end
end
