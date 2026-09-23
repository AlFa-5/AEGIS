import KpiCard from './components/KpiCard'

function App() {
  return (
    <main className="min-h-screen bg-[#080B14] text-[#F1F5F9]">
      <div className="mx-auto max-w-7xl px-8 py-8">

        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              AEGIS
            </h1>

            <p className="mt-1 text-sm text-[#8B95A7]">
              Personal Security Monitor
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-[#34D399]">
              ● SYSTEM ONLINE
            </div>

            <div className="mt-1 text-xs text-[#8B95A7]">
              20:42:18
            </div>
          </div>
        </header>

        <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <KpiCard
            title="CPU"
            value="37.4%"
            description="Processor Usage"
            icon="◉"
            progress={37}
            status="NORMAL"
            details={[
              { label: 'Cores', value: '8' },
              { label: 'Frequency', value: '3.80 GHz' },
            ]}
          />

          <KpiCard
            title="MEMORY"
            value="61.2%"
            description="Memory Usage"
            icon="▣"
            progress={61}
            status="NORMAL"
            details={[
              { label: 'Used', value: '9.8 GB' },
              { label: 'Available', value: '6.2 GB' },
            ]}
          />

          <KpiCard
            title="STORAGE"
            value="72.1%"
            description="Disk Usage"
            icon="◈"
            progress={72}
            status="WARNING"
            details={[
              { label: 'Used', value: '172 GB' },
              { label: 'Free', value: '66 GB' },
            ]}
          />

          <KpiCard
            title="NETWORK"
            value="8.4 MB/s"
            description="Download"
            icon="⇅"
            progress={65}
            status="NORMAL"
            details={[
              { label: 'Upload', value: '3.6 MB/s' },
              { label: 'Interface', value: 'wlan0' },
            ]}
          />

        </section>

      </div>
    </main>
  )
}

export default App