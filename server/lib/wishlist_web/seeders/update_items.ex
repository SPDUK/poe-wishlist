alias Wishlist.Dashboard.LeagueItem
alias Wishlist.Dashboard.HcItem
alias Wishlist.Dashboard.HcLeagueItem
alias Wishlist.Dashboard.Item

alias Wishlist.Repo

defmodule Wishlist.UpdateItems do
  def setup do
    item_leagues = %{
      "Standard" => Item,
      "Hardcore" => HcItem,
      "Legion" => LeagueItem,
      "Hardcore%20Legion" => HcLeagueItem
    }

    for {name, schema} <- item_leagues do
      get_urls(name, schema)
    end
  end

  def get_urls(league, schema) do
    itemUrls = [
      "https://poe.ninja/api/Data/GetDivinationCardsOverview?league=#{league}",
      "https://poe.ninja/api/Data/GetUniqueArmourOverview?league=#{league}",
      "https://poe.ninja/api/Data/GetUniqueFlaskOverview?league=#{league}",
      "https://poe.ninja/api/Data/GetUniqueWeaponOverview?league=#{league}",
      "https://poe.ninja/api/Data/GetUniqueJewelOverview?league=#{league}",
      "https://poe.ninja/api/Data/GetUniqueAccessoryOverview?league=#{league}",
      "https://poe.ninja/api/Data/GetEssenceOverview?league=#{league}"
    ]

    for url <- itemUrls do
      insert_or_update(url, schema)
    end
  end

  def insert_or_update(url, schema) do
    HTTPoison.start()
    response = HTTPoison.get!(url)

    items =
      Poison.decode!(response.body)
      |> Map.get("lines")

    for item <- items do
      result =
        case Repo.get_by(schema, api_id: item["id"]) do
          # Item not found, build one from the passed in schema and the values from the api
          nil ->
            struct(
              schema,
              %{
                api_id: item["id"],
                chaosValue: item["chaosValue"],
                name: item["name"],
                icon: item["icon"],
                variant: item["variant"],
                levelRequired: item["levelRequired"],
                links: item["links"],
                itemClass: item["itemClass"],
                itemType: item["itemType"],
                implicitModifiers: item["implicitModifiers"],
                explicitModifiers: item["explicitModifiers"],
                flavourText: item["flavourText"],
                sparkline: item["sparkline"],
                lowConfidenceSparkline: item["lowConfidenceSparkline"]
              }
            )

          # Item exists, use it with the changeset to see if there are changes
          item ->
            item
        end
        |> schema.changeset(%{chaosValue: item["chaosValue"]})
        |> Repo.insert_or_update()

      case result do
        {:ok, _struct} ->
          :ok

        {:error, changeset} ->
          IO.inspect(changeset)
          IO.inspect(:error)
      end
    end
  end
end
