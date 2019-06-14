defmodule Wishlist.Repo.Migrations.UpdateHcitemsTableCrafts do
  use Ecto.Migration

  def change do
    alter table(:hcitems) do
      remove(:crafted)
    end
  end
end
