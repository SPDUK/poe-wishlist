alias Wishlist.Dashboard.Currency
alias Wishlist.Dashboard.HcCurrency
alias Wishlist.Dashboard.LeagueCurrency
alias Wishlist.Dashboard.HcLeagueCurrency

alias Wishlist.Repo

defmodule Wishlist.UpdateCurrency do
  def setup do
    currency_leagues = %{
      "Standard" => Currency,
      "Hardcore" => HcCurrency,
      "Legion" => LeagueCurrency,
      "Hardcore%20Legion" => HcLeagueCurrency
    }

    for {name, schema} <- currency_leagues do
      url = "https://poe.ninja/api/Data/GetCurrencyOverview?league=#{name}"
      insert_or_update(url, schema)
    end
  end

  def check_for_icons(schema, name, currency_details) do
    case Repo.get_by(schema, name: name) do
      nil ->
        nil

      curr ->
        # look through the currency_details for that league and find the one where the names match, then return that map
        details = Enum.find(currency_details, fn details -> Map.get(details, "name") === name end)

        schema.changeset(curr, %{icon: details["icon"]})
        |> Repo.update()
    end
  end

  def insert_or_update(url, schema) do
    HTTPoison.start()
    response = HTTPoison.get!(url)

    IO.inspect(response.body)
    data = Poison.decode!(response.body)

    currencies = Map.get(data, "lines")
    currency_details = Map.get(data, "currencyDetails")

    for currency <- currencies do
      result =
        case Repo.get_by(schema, name: currency["currencyTypeName"]) do
          nil ->
            struct(
              schema,
              %{
                chaosValue: currency["chaosEquivalent"],
                name: currency["currencyTypeName"],
                icon: nil,
                sparkLine: currency["receiveSparkLine"],
                lowConfidenceSparkLine: currency["lowConfidenceReceiveSparkLine"]
              }
            )

          item ->
            item
        end
        |> schema.changeset(%{
          chaosValue: currency["chaosEquivalent"],
          sparkLine: currency["receiveSparkLine"],
          lowConfidenceSparkLine: currency["lowConfidenceReceiveSparkLine"]
        })
        |> Repo.insert_or_update()

      case result do
        {:ok, _struct} ->
          # if we created or updated an item check to see if it has an icon
          check_for_icons(schema, currency["currencyTypeName"], currency_details)

        {:error, changeset} ->
          # no reason to handle errors but this helps for debugging
          IO.puts(changeset)
      end
    end
  end
end
