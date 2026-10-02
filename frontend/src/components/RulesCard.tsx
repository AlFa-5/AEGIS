import { useEffect, useState } from 'react'

type RulesCardProps = {
  refreshKey: number
}

type ApiRule = {
  rule: string
  enabled: boolean
}

type Rule = {
  sid: number
  name: string
  severity: 'high' | 'medium' | 'low'
  enabled: boolean
}

function parseRule(apiRule: ApiRule): Rule {
  const sidMatch = apiRule.rule.match(
    /sid\s*:\s*(\d+)/i
  )

  const msgMatch = apiRule.rule.match(
    /msg\s*:\s*"([^"]+)"/i
  )

  return {
    sid: sidMatch ? Number(sidMatch[1]) : 0,
    name: msgMatch
      ? msgMatch[1]
      : 'Unnamed rule',
    severity: 'medium',
    enabled: apiRule.enabled,
  }
}

function RulesCard({ refreshKey }: RulesCardProps) {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true)

      try {
        const response = await fetch(
          'http://127.0.0.1:8000/api/rules'
        )

        if (!response.ok) {
          throw new Error(
            'Failed to fetch rules'
          )
        }

        const data = await response.json()

        const parsedRules = data.rules.map(
          (apiRule: ApiRule) =>
            parseRule(apiRule)
        )

        setRules(parsedRules)
      } catch (error) {
        console.error(
          'Error loading rules:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRules()
  }, [refreshKey])

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#101522] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.12)]">

      {/* LEFT ACCENT */}

      <div className="absolute left-0 top-0 h-full w-[2px] bg-[#7C3AED] opacity-70" />

      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#22D3EE]/20 bg-[#22D3EE]/10 text-lg text-[#22D3EE]">
            ≡
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide">
              Detection Rules
            </p>

            <p className="mt-1 text-[11px] uppercase tracking-wider text-[#8B95A7]">
              Active signatures
            </p>
          </div>

        </div>

        <span className="text-[10px] font-bold tracking-wider text-[#34D399]">
          ● LIVE
        </span>

      </div>

      {/* RULES */}

      <div className="mt-6 max-h-[420px] space-y-3 overflow-y-auto pr-2">

        {loading ? (

          <div className="rounded-xl border border-white/[0.06] bg-[#0C111D] px-4 py-6 text-center">

            <p className="text-[11px] text-[#8B95A7]">
              Loading rules...
            </p>

          </div>

        ) : rules.length === 0 ? (

          <div className="rounded-xl border border-white/[0.06] bg-[#0C111D] px-4 py-6 text-center">

            <p className="text-[11px] text-[#8B95A7]">
              No rules configured
            </p>

          </div>

        ) : (

          rules.map(rule => (

            <div
              key={rule.sid}
              className="rounded-xl border border-white/[0.06] bg-[#0C111D] p-4 transition-all duration-200 hover:border-white/[0.12]"
            >

              {/* RULE HEADER */}

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  <p className="truncate text-xs font-semibold text-[#F1F5F9]">
                    {rule.name}
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-[#8B95A7]">
                    SID: {rule.sid}
                  </p>

                </div>

                {/* STATUS */}

                <div className="flex shrink-0 items-center gap-2">

                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      rule.enabled
                        ? 'bg-[#34D399]'
                        : 'bg-[#4B5563]'
                    }`}
                  />

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      rule.enabled
                        ? 'text-[#34D399]'
                        : 'text-[#8B95A7]'
                    }`}
                  >
                    {rule.enabled
                      ? 'Enabled'
                      : 'Disabled'}
                  </span>

                </div>

              </div>

              {/* RULE INFO */}

              <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">

                <span className="text-[9px] uppercase tracking-wider text-[#8B95A7]">
                  Severity
                </span>

                <span
                  className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                    rule.severity === 'high'
                      ? 'border border-red-500/20 bg-red-500/10 text-red-400'
                      : rule.severity === 'medium'
                        ? 'border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B]'
                        : 'border border-[#34D399]/20 bg-[#34D399]/10 text-[#34D399]'
                  }`}
                >
                  {rule.severity}
                </span>

              </div>

            </div>

          ))

        )}

      </div>

      {/* FOOTER */}

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">

        <span className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
          {rules.length}{' '}
          {rules.length === 1
            ? 'rule'
            : 'rules'}
        </span>

        <span className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
          Suricata
        </span>

      </div>

    </div>
  )
}

export default RulesCard