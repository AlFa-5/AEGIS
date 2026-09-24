import { useEffect, useState } from 'react'
import KpiCard from './components/KpiCard'
import Header from './components/Header'

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
    bytes_received: number
    bytes_sent: number
    packets_received: number
    packets_sent: number
  }
  connections: unknown[]
}

function App() {
  const [system, setSystem] = useState<SystemData | null>(null)
  const [network, setNetwork] = useState<NetworkData | null>(null)

  useEffect(() => {
    const fetchData = () => {
      fetch('http://127.0.0.1:8000/api/system')
        .then(response => response.json())
        .then(data => setSystem(data))
        .catch(error => console.error(error))
  
      fetch('http://127.0.0.1:8000/api/network')
        .then(response => response.json())
        .then(data => setNetwork(data))
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

        <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <KpiCard
            title="CPU"
            value={`${system.cpu.usage_percent.toFixed(1)}%`}
            description="Processor Usage"
            icon="◉"
            progress={system.cpu.usage_percent}
            status="NORMAL"
            details={[
              { label: 'Cores', value: `${system.cpu.cores}` },
              { label: 'Frequency', value: `${(system.cpu.frequency_mhz / 1000).toFixed(2)} GHz` },
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
                value: `${(system.memory.usage_bytes / 1024 ** 3).toFixed(1)} GB`,
              },
              {
                label: 'Available',
                value: `${(system.memory.available_bytes / 1024 ** 3).toFixed(1)} GB`,
              },
              {
                label: 'Total',
                value: `${(system.memory.total_bytes / 1024 ** 3).toFixed(1)} GB`,
              },
            ]}
          />

          <KpiCard
            title="STORAGE"
            value={`${system.disk.usage_percent.toFixed(1)}%`}
            description="Disk Usage"
            icon="◈"
            progress={system.disk.usage_percent}
            status={system.disk.usage_percent >= 70 ? 'WARNING' : 'NORMAL'}
            details={[
              {
                label: 'Used',
                value: `${(system.disk.used_bytes / 1024 ** 3).toFixed(1)} GB`,
              },
              {
                label: 'Free',
                value: `${(system.disk.free_bytes / 1024 ** 3).toFixed(1)} GB`,
              },
              {
                label: 'Total',
                value: `${(system.disk.total_bytes / 1024 ** 3).toFixed(1)} GB`,
              },
            ]}
          />

            <KpiCard
              title="NETWORK"
              value={`${(network.traffic.download_bytes_per_second / 1024).toFixed(1)} KB/s`}
              description="Download"
              icon="⇅"
              progress={0}
              status="NORMAL"
              details={[
                {
                  label: 'Upload',
                  value: `${(network.traffic.upload_bytes_per_second / 1024).toFixed(1)} KB/s`,
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

      </div>
    </main>
  )
}

export default App