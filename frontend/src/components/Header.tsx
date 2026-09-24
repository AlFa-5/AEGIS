function Header() {
  return (
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
  )
}

export default Header
