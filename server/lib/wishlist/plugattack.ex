defmodule Wishlist.PlugAttack do
  import Plug.Conn
  use PlugAttack

  # limits to 120 requests every minute
  rule "throttle by ip", conn do
    throttle(conn.remote_ip,
      period: 60_000,
      limit: 120,
      storage: {PlugAttack.Storage.Ets, Wishlist.PlugAttack.Storage}
    )
  end
end
