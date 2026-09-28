type Rule = {
  sid: number
  name: string
  severity: 'high' | 'medium' | 'low'
  enabled: boolean
}

const rules: Rule[] = [
  {
    sid: 100001,
    name: 'SSH connection detected',
    severity: 'high',
    enabled: true,
  },
  {
    sid: 100002,
    name: 'Port scan detected',
    severity: 'high',
    enabled: true,
  },
  {
    sid: 100003,
    name: 'Suspicious HTTP request',
    severity: 'medium',
    enabled: false,
  },
]

function RulesCard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#101522] transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-[0_0_35px_rgba(124,58,237,0.12)]">

      {/* PURPLE ACCENT */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-[#7C3AED] opacity-70" />

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

        <div>
          <p className="text-sm font-semibold tracking-wide">
            Detection Rules
          </p>

          <p className="mt-1 text-[10px] uppercase tracking-wider text-[#8B95A7]">
            Active signatures
          </p>
        </div>

        <span className="rounded-md border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-2 py-1 text-[10px] font-bold text-[#7C3AED]">
          {rules.length} RULES
        </span>

      </div>

      {/* RULES */}
      <div className="divide-y divide-white/[0.05]">

        {rules.map(rule => (

          <div
            key={rule.sid}
            className="px-5 py-4 transition hover:bg-white/[0.02]"
          >

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-start gap-3">

                <span
                  className={`mt-1 h-2 w-2 rounded-full ${
                    rule.enabled
                      ? 'bg-[#34D399]'
                      : 'bg-[#4B5563]'
                  }`}
                />

                <div>

                  <p className="text-sm font-medium text-[#F1F5F9]">
                    {rule.name}
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-[#8B95A7]">
                    SID: {rule.sid}
                  </p>

                </div>

              </div>

              <span
                className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                  rule.severity === 'high'
                    ? 'bg-red-500/10 text-red-400'
                    : rule.severity === 'medium'
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'bg-green-500/10 text-green-400'
                }`}
              >
                {rule.severity}
              </span>

            </div>

            <div className="ml-5 mt-3 text-[9px] uppercase tracking-wider text-[#8B95A7]">
              {rule.enabled ? 'ENABLED' : 'DISABLED'}
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default RulesCard