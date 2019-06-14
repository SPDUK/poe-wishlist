defmodule Wishlist.Repo.Migrations.UpdateItemsTableCrafts do
  use Ecto.Migration

  def change do
    alter table(:items) do
      remove(:crafted)
    end
  end
end
