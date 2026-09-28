type HeaderProps = {
  page: 'dashboard' | 'detection'
  setPage: (page: 'dashboard' | 'detection') => void
}

function Header({ page, setPage }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      {/* LEFT */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          AEGIS
        </h1>

        <p className="mt-1 text-sm text-[#8B95A7]">
          Personal Security Monitor
        </p>

        {/* NAVIGATION */}
        <nav className="mt-5 flex gap-2">
          <button
            onClick={() => setPage('dashboard')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              page === 'dashboard'
                ? 'bg-[#22D3EE] text-[#080B14]'
                : 'text-[#8B95A7] hover:bg-[#101522] hover:text-[#F1F5F9]'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setPage('detection')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              page === 'detection'
                ? 'bg-[#22D3EE] text-[#080B14]'
                : 'text-[#8B95A7] hover:bg-[#101522] hover:text-[#F1F5F9]'
            }`}
          >
            Detection
          </button>
        </nav>
      </div>

      {/* RIGHT */}
      <div className="text-right">
        <div className="text-sm text-[#34D399]">
          ● SYSTEM ONLINE
        </div>

        <div className="mt-1 text-xs text-[#8B95A7]">
          20:42:18
        </div>
      </div>
    </header>
  )
}

export default Header