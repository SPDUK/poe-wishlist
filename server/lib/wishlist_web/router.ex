defmodule WishlistWeb.Router do
  alias Wishlist.PlugAttack
  use WishlistWeb, :router

  pipeline :api do
    plug(PlugAttack)
    plug(CORSPlug, origin: "https://poewishlist.netlify.com")
    plug(:accepts, ["json"])
  end

  scope "/api", WishlistWeb do
    pipe_through(:api)

    # just for testing to view the version number in production to check everything worked
    get("/version", ItemController, :version)

    post("/standard/items/build", ItemController, :build)
    get("/standard/items/names", ItemController, :list_names)
    get("/standard/items/all", ItemController, :index)
    post("/standard/items/findone", ItemController, :find_one)
    post("/standard/items/findbyname", ItemController, :find_by_name)
    post("/standard/items/pob", ItemController, :pob)
    get("/standard/currency/", CurrencyController, :index)

    post("/hc/items/build", HcItemController, :build)
    get("/hc/items/names", HcItemController, :list_names)
    get("/hc/items/all", HctemController, :index)
    post("/hc/items/findone", HcItemController, :find_one)
    post("/hc/items/findbyname", HcItemController, :find_by_name)
    post("/hc/items/pob", HcItemController, :pob)
    get("/hc/currency/", HcCurrencyController, :index)

    post("/league/items/build", LeagueItemController, :build)
    get("/league/items/names", LeagueItemController, :list_names)
    get("/league/items/all", LeagueItemController, :index)
    post("/league/items/findone", LeagueItemController, :find_one)
    post("/league/items/findbyname", LeagueItemController, :find_by_name)
    post("/league/items/pob", LeagueItemController, :pob)
    get("/league/currency/", LeagueCurrencyController, :index)

    post("/hcleague/items/build", HcLeagueItemController, :build)
    get("/hcleague/items/names", HcLeagueItemController, :list_names)
    get("/hcleague/items/all", HcLeagueItemController, :index)
    post("/hcleague/items/findone", HcLeagueItemController, :find_one)
    post("/hcleague/items/findbyname", HcLeagueItemController, :find_by_name)
    post("/hcleague/items/pob", HcLeagueItemController, :pob)
    get("/hcleague/currency/", HcLeagueCurrencyController, :index)
  end
end
