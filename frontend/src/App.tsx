import { useEffect, useState } from 'react'
import KpiCard from './components/KpiCard'
import Header from './components/Header'
import NetworkConnectionsCard from './components/NetworkConnectionsCard'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type SystemData = {
  cpu: {
    usage_percent: number
    cores: number
    frequency_mhz: number
  }
  memory: {
    usage_percent: number
    usage_bytes: number
    available_bytes: number
    total_bytes: number
  }
  disk: {
    usage_percent: number
    used_bytes: number
    free_bytes: number
    total_bytes: number
  }
}

type NetworkData = {
  interfaces: {
    name: string
    is_up: boolean
    speed_mbps: number
    ip: string | null
    mac: string
  }[]
  traffic: {
    download_bytes_per_second: number
    upload_bytes_per_second: number
    packets_received: number
    packets_sent: number
  }
  connections: unknown[]
  connection_summary: {
    established: number
    listening: number
    tcp: number
    udp: number
    remote_endpoints: {
      ip: string
      port: number
    }[]
  }
}

function App() {
  const [system, setSystem] = useState<SystemData | null>(null)
  const [network, setNetwork] = useState<NetworkData | null>(null)

  const [trafficHistory, setTrafficHistory] = useState<
    {
      time: string
      download: number
      upload: number
    }[]
  >([])

  useEffect(() => {
    const fetchData = () => {
      fetch('http://127.0.0.1:8000/api/system')
        .then(response => response.json())
        .then(data => setSystem(data))
        .catch(error => console.error(error))

      fetch('http://127.0.0.1:8000/api/network')
        .then(response => response.json())
        .then(data => {
          setNetwork(data)

          setTrafficHistory(prev => {
            const newPoint = {
              time: new Date().toLocaleTimeString('fr-FR', {
                minute: '2-digit',
                second: '2-digit',
              }),
              download:
                data.traffic.download_bytes_per_second / 1024,
              upload:
                data.traffic.upload_bytes_per_second / 1024,
            }

            return [...prev, newPoint].slice(-15)
          })
        })
        .catch(error => console.error(error))
    }

    fetchData()

    const interval = setInterval(fetchData, 2000)

    return () => clearInterval(interval)
  }, [])

  if (!system || !network) {
    return <div className="p-8 text-white">Loading...</div>
  }

  const internetInterface = network.interfaces.find(
    i => i.is_up && i.name !== 'lo' && i.ip
  )

  return (
    <main className="min-h-screen bg-[#080B14] text-[#F1F5F9]">
      <div className="mx-auto max-w-7xl px-8 py-8">

        <Header />

        {/* ==================== KPI ==================== */}

        <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <KpiCard
            title="CPU"
            value={`${system.cpu.usage_percent.toFixed(1)}%`}
            description="Processor Usage"
            icon="◉"
            progress={system.cpu.usage_percent}
            status="NORMAL"
            details={[
              {
                label: 'Cores',
                value: `${system.cpu.cores}`,
              },
              {
                label: 'Frequency',
                value: `${(
                  system.cpu.frequency_mhz / 1000
                ).toFixed(2)} GHz`,
              },
            ]}
          />

          <KpiCard
            title="MEMORY"
            value={`${system.memory.usage_percent.toFixed(1)}%`}
            description="Memory Usage"
            icon="▣"
            progress={system.memory.usage_percent}
            status="NORMAL"
            details={[
              {
                label: 'Used',
                value: `${(
                  system.memory.usage_bytes /
                  1024 ** 3
                ).toFixed(1)} GB`,
              },
              {
                label: 'Available',
                value: `${(
                  system.memory.available_bytes /
                  1024 ** 3
                ).toFixed(1)} GB`,
              },
              {
                label: 'Total',
                value: `${(
                  system.memory.total_bytes /
                  1024 ** 3
                ).toFixed(1)} GB`,
              },
            ]}
          />

          <KpiCard
            title="STORAGE"
            value={`${system.disk.usage_percent.toFixed(1)}%`}
            description="Disk Usage"
            icon="◈"
            progress={system.disk.usage_percent}
            status={
              system.disk.usage_percent >= 70
                ? 'WARNING'
                : 'NORMAL'
            }
            details={[
              {
                label: 'Used',
                value: `${(
                  system.disk.used_bytes /
                  1024 ** 3
                ).toFixed(1)} GB`,
              },
              {
                label: 'Free',
                value: `${(
                  system.disk.free_bytes /
                  1024 ** 3
                ).toFixed(1)} GB`,
              },
              {
                label: 'Total',
                value: `${(
                  system.disk.total_bytes /
                  1024 ** 3
                ).toFixed(1)} GB`,
              },
            ]}
          />

          <KpiCard
            title="NETWORK"
            value={`${(
              network.traffic.download_bytes_per_second /
              1024
            ).toFixed(1)} KB/s`}
            description="Download"
            icon="⇅"
            progress={0}
            status="NORMAL"
            details={[
              {
                label: 'Upload',
                value: `${(
                  network.traffic.upload_bytes_per_second /
                  1024
                ).toFixed(1)} KB/s`,
              },
              {
                label: 'Interface',
                value: internetInterface?.name || 'N/A',
              },
              {
                label: 'IP',
                value: internetInterface?.ip || 'N/A',
              },
              {
                label: 'MAC',
                value: internetInterface?.mac || 'N/A',
              },
            ]}
          />

        </section>

        {/* ==================== NETWORK ==================== */}

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* ==================== NETWORK TRAFFIC ==================== */}

          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#101522] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-[0_0_35px_rgba(124,58,237,0.12)] lg:col-span-2">

            <div className="absolute left-0 top-0 h-full w-[2px] bg-[#7C3AED] opacity-70" />

            {/* Header */}

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/10 text-lg text-[#22D3EE]">
                  ⇅
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-wide">
                    Network Traffic
                  </p>

                  <p className="mt-1 text-[11px] uppercase tracking-wider text-[#8B95A7]">
                    Real-time throughput
                  </p>
                </div>

              </div>

              <span className="text-[10px] font-bold tracking-wider text-[#34D399]">
                ● LIVE
              </span>

            </div>

            {/* Current values */}

            <div className="mt-6 flex items-center gap-8">

              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
                  Download
                </p>

                <p className="mt-1 font-mono text-lg font-semibold text-[#34D399]">
                  {(
                    network.traffic.download_bytes_per_second /
                    1024
                  ).toFixed(1)}

                  <span className="ml-1 text-[10px] font-normal text-[#8B95A7]">
                    KB/s
                  </span>
                </p>
              </div>

              <div className="h-8 w-px bg-white/[0.06]" />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
                  Upload
                </p>

                <p className="mt-1 font-mono text-lg font-semibold text-[#22D3EE]">
                  {(
                    network.traffic.upload_bytes_per_second /
                    1024
                  ).toFixed(1)}

                  <span className="ml-1 text-[10px] font-normal text-[#8B95A7]">
                    KB/s
                  </span>
                </p>
              </div>

            </div>

            {/* Chart */}

            <div className="mt-5 h-[230px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={trafficHistory}
                  margin={{
                    top: 5,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    horizontal
                    vertical={false}
                    stroke="rgba(255,255,255,0.045)"
                    strokeDasharray="2 6"
                  />

                  <XAxis
                    dataKey="time"
                    tick={{
                      fill: '#8B95A7',
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                  />

                  <YAxis
                    tick={{
                      fill: '#8B95A7',
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    width={42}
                    tickFormatter={value => `${value}`}
                  />

                  <Tooltip
                    cursor={{
                      stroke: 'rgba(124,58,237,0.25)',
                      strokeWidth: 1,
                    }}
                    contentStyle={{
                      background: '#101522',
                      border:
                        '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      boxShadow:
                        '0 15px 35px rgba(0,0,0,0.35)',
                      padding: '10px 12px',
                    }}
                    labelStyle={{
                      color: '#8B95A7',
                      fontSize: '10px',
                      marginBottom: '5px',
                    }}
                    itemStyle={{
                      fontSize: '11px',
                      padding: '2px 0',
                    }}
                    formatter={(value, name) => [
                      `${Number(value).toFixed(1)} KB/s`,
                      name,
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="download"
                    name="Download"
                    stroke="#34D399"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                      stroke: '#101522',
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="upload"
                    name="Upload"
                    stroke="#22D3EE"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                      stroke: '#101522',
                    }}
                  />

                </LineChart>
              </ResponsiveContainer>

            </div>

            {/* Footer */}

            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-4">

              <div className="flex items-center gap-5">

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-5 rounded-full bg-[#34D399]" />

                  <span className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
                    Download
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-5 rounded-full bg-[#22D3EE]" />

                  <span className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
                    Upload
                  </span>
                </div>

              </div>

              <div className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
                2s sampling · 15 points
              </div>

            </div>

          </div>

          {/* ==================== NETWORK CONNECTIONS ==================== */}

          <NetworkConnectionsCard
            summary={network.connection_summary}
          />

        </section>

      </div>
    </main>
  )
}

export default App
