type AlertSeverity = "HIGH" | "MEDIUM" | "LOW"

type Alert = {
  id: number
  severity: AlertSeverity
  title: string
  description: string
  source: string
  timestamp: string
}

const alerts: Alert[] = [
  {
    id: 1,
    severity: "HIGH",
    title: "Suspicious network connection",
    description: "Unexpected connection detected",
    source: "192.168.1.25",
    timestamp: "20:14:32",
  },
  {
    id: 2,
    severity: "MEDIUM",
    title: "Unusual traffic detected",
    description: "Network traffic exceeds normal behavior",
    source: "wlan0",
    timestamp: "20:11:07",
  },
  {
    id: 3,
    severity: "LOW",
    title: "New connection established",
    description: "A new network connection was detected",
    source: "192.168.1.42",
    timestamp: "20:05:21",
  },
]

function AlertsCard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#101522] transition-all duration-300 hover:border-[#7C3AED]/40 hover:shadow-[0_0_35px_rgba(124,58,237,0.12)]">

      {/* Accent line */}

      <div className="absolute left-0 top-0 h-full w-[2px] bg-[#7C3AED] opacity-70" />

      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">

        <div>
          <p className="text-sm font-semibold tracking-wide text-[#F1F5F9]">
            Alerts & Detection
          </p>

          <p className="mt-1 text-[11px] uppercase tracking-wider text-[#8B95A7]">
            Security events detected by AEGIS
          </p>
        </div>

        <div className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#151B2A] px-2">

          <span className="text-xs font-semibold text-[#F1F5F9]">
            {alerts.length}
          </span>

        </div>

      </div>

      {/* Alerts */}

      <div>

        {alerts.map((alert) => (

          <div
            key={alert.id}
            className="flex gap-4 border-b border-white/[0.05] px-6 py-5 last:border-b-0 hover:bg-white/[0.015]"
          >

            {/* Severity indicator */}

            <div className="pt-1">

              <div
                className={`h-2 w-2 rounded-full ${
                  alert.severity === "HIGH"
                    ? "bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.55)]"
                    : alert.severity === "MEDIUM"
                    ? "bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.45)]"
                    : "bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.45)]"
                }`}
              />

            </div>

            {/* Content */}

            <div className="min-w-0 flex-1">

              <div className="flex items-center justify-between gap-4">

                <span
                  className={`text-[10px] font-bold tracking-widest ${
                    alert.severity === "HIGH"
                      ? "text-[#EF4444]"
                      : alert.severity === "MEDIUM"
                      ? "text-[#F59E0B]"
                      : "text-[#34D399]"
                  }`}
                >
                  {alert.severity}
                </span>

                <span className="font-mono text-[10px] text-[#647084]">
                  {alert.timestamp}
                </span>

              </div>

              <p className="mt-2 text-sm font-medium text-[#E5E7EB]">
                {alert.title}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-[#7F8A9D]">
                {alert.description}
              </p>

              <span className="mt-3 inline-block rounded-md border border-white/[0.07] bg-[#0D1320] px-2 py-1 font-mono text-[10px] text-[#8B95A7]">
                {alert.source}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default AlertsCard
