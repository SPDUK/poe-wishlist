defmodule Wishlist.Application do
  use Application

  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      # Start the Ecto repository
      supervisor(Wishlist.Repo, []),
      # Start the endpoint when the application starts
      supervisor(WishlistWeb.Endpoint, []),
      # Scheduler for updating database every n minutes
      worker(Wishlist.Scheduler, []),
      # Plugattack for anti DDOS / spam requests
      worker(PlugAttack.Storage.Ets, [Wishlist.PlugAttack.Storage, [clean_period: 60_000]])
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Wishlist.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    WishlistWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
