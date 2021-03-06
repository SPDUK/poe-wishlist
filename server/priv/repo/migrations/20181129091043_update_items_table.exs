defmodule Wishlist.Repo.Migrations.UpdateItemsTable do
  use Ecto.Migration

  def change do
    alter table(:items) do
      add(:custom, :boolean, default: false)
      add(:crafted, :boolean, default: false)
    end
  end
end
