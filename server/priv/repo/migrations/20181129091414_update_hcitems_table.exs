defmodule Wishlist.Repo.Migrations.UpdateHcitemsTable do
  use Ecto.Migration

  def change do
    alter table(:hcitems) do
      add(:custom, :boolean, default: false)
      add(:crafted, :boolean, default: false)
    end
  end
end
