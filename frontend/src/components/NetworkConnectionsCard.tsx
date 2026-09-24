interface ConnectionSummary {
  established: number
  listening: number
  tcp: number
  udp: number
  remote_endpoints: {
    ip: string
    port: number
  }[]
}

interface NetworkConnectionsCardProps {
  summary: ConnectionSummary
}

function NetworkConnectionsCard({
  summary,
}: NetworkConnectionsCardProps) {
  const externalEndpoints = summary.remote_endpoints
    .filter(endpoint => !endpoint.ip.startsWith('127.'))
    .filter(
      (endpoint, index, array) =>
        array.findIndex(
          item =>
            item.ip === endpoint.ip &&
            item.port === endpoint.port
        ) === index
    )
    .slice(0, 5)

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#101522] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-[0_0_35px_rgba(124,58,237,0.12)]">

      {/* Accent */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-[#7C3AED] opacity-70" />

      {/* Header */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/10 text-lg text-[#22D3EE]">
            ⇄
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide">
              NETWORK CONNECTIONS
            </p>

            <p className="mt-1 text-[11px] uppercase tracking-wider text-[#8B95A7]">
              Active network state
            </p>
          </div>

        </div>

        <span className="text-[10px] font-bold tracking-wider text-[#34D399]">
          ● MONITORING
        </span>

      </div>

      {/* Main stats */}
      <div className="mt-7 grid grid-cols-2 gap-6">

        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
            Established
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight">
            {summary.established}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
            Listening
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight">
            {summary.listening}
          </p>
        </div>

      </div>

      {/* Protocols */}
      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-5">

        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
            TCP
          </p>

          <p className="mt-1 text-sm font-medium">
            {summary.tcp}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
            UDP
          </p>

          <p className="mt-1 text-sm font-medium">
            {summary.udp}
          </p>
        </div>

      </div>

      {/* Remote endpoints */}
      <div className="mt-5 border-t border-white/[0.06] pt-5">

        <p className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
          Remote endpoints
        </p>

        <div className="mt-3 space-y-2">

          {externalEndpoints.length > 0 ? (
            externalEndpoints.map(endpoint => (
              <div
                key={`${endpoint.ip}:${endpoint.port}`}
                className="flex items-center justify-between text-xs"
              >
                <span className="font-mono text-[#CBD5E1]">
                  {endpoint.ip}
                </span>

                <span className="font-mono text-[#8B95A7]">
                  :{endpoint.port}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#8B95A7]">
              No external endpoints
            </p>
          )}

        </div>

      </div>

    </div>
  )
}

export default NetworkConnectionsCard