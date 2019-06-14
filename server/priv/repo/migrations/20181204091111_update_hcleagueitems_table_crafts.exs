defmodule Wishlist.Repo.Migrations.UpdateHcleagueitemsTableCrafts do
  use Ecto.Migration

  def change do
    alter table(:hcleagueitems) do
      remove(:crafted)
    end
  end
end
