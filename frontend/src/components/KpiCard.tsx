interface KpiCardProps {
    title: string
    value: string
    description: string
    icon: string
    progress: number
    details: {
      label: string
      value: string
    }[]
    status: 'NORMAL' | 'WARNING' | 'CRITICAL'
  }
  
  function KpiCard({
    title,
    value,
    description,
    icon,
    progress,
    details,
    status,
  }: KpiCardProps) {
    const statusColor = {
      NORMAL: 'text-[#34D399]',
      WARNING: 'text-[#F59E0B]',
      CRITICAL: 'text-[#F43F5E]',
    }
  
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#101522] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-[0_0_35px_rgba(124,58,237,0.12)]">
  
        {/* Accent */}
        <div className="absolute left-0 top-0 h-full w-[2px] bg-[#7C3AED] opacity-70" />
  
        {/* Header */}
        <div className="flex items-start justify-between">
  
          <div className="flex items-center gap-3">
  
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/10 text-lg text-[#22D3EE]">
              {icon}
            </div>
  
            <div>
              <p className="text-sm font-semibold tracking-wide">
                {title}
              </p>
  
              <p className="mt-1 text-[11px] uppercase tracking-wider text-[#8B95A7]">
                {description}
              </p>
            </div>
  
          </div>
  
          <span className={`text-[10px] font-bold tracking-wider ${statusColor[status]}`}>
            ● {status}
          </span>
  
        </div>
  
        {/* Main value */}
        <div className="mt-7">
          <span className="text-4xl font-bold tracking-tight">
            {value}
          </span>
        </div>
  
        {/* Progress */}
        <div className="mt-5">
  
          <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wider text-[#8B95A7]">
            <span>Resource usage</span>
            <span>{progress}%</span>
          </div>
  
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
  
        </div>
  
        {/* Details */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-5">
  
          {details.map((detail) => (
            <div key={detail.label}>
              <p className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
                {detail.label}
              </p>
  
              <p className="mt-1 text-sm font-medium">
                {detail.value}
              </p>
            </div>
          ))}
  
        </div>
  
      </div>
    )
  }
  
  export default KpiCard