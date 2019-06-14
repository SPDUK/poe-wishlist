defmodule Wishlist.Repo.Migrations.UpdateHcleagueitemsTable do
  use Ecto.Migration

  def change do
    alter table(:hcleagueitems) do
      add(:custom, :boolean, default: false)
      add(:crafted, :boolean, default: false)
    end
  end
end
