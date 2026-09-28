import { useState } from 'react'

function RuleEditor() {
  const [rule, setRule] = useState(
    `alert tcp any any -> any 22 (
  msg:"SSH connection detected";
  sid:100001;
  severity:high;
)`
  )

  const lines = rule.split('\n')

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#101522] transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.12)]">

      {/* CYAN ACCENT */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-[#7C3AED] opacity-70" />

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div>
          <p className="text-sm font-semibold tracking-wide">
            Rule Editor
          </p>

          <p className="mt-1 text-[10px] uppercase tracking-wider text-[#8B95A7]">
            Detection signature
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#34D399]" />

          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B95A7]">
            Editor Ready
          </span>
        </div>
      </div>

      {/* EDITOR */}
      <div className="bg-[#080B14]">
        <div className="flex min-h-[320px] font-mono text-sm">

          {/* LINE NUMBERS */}
          <div className="select-none border-r border-white/[0.06] px-4 py-4 text-right text-[#4B5563]">
            {lines.map((_, index) => (
              <div key={index} className="leading-6">
                {(index + 1).toString().padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* TEXT AREA */}
          <textarea
            value={rule}
            onChange={event => setRule(event.target.value)}
            spellCheck={false}
            className="min-h-[320px] flex-1 resize-none bg-transparent px-4 py-4 leading-6 text-[#F1F5F9] outline-none placeholder:text-[#4B5563]"
          />

        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-4">

        <div className="font-mono text-[10px] text-[#8B95A7]">
          {lines.length} lines
        </div>

        <div className="flex gap-2">

          <button
            className="rounded-lg border border-white/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8B95A7] transition hover:border-[#22D3EE]/40 hover:text-[#22D3EE]"
          >
            Validate
          </button>

          <button
          className="rounded-lg bg-[#22D3EE] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#080B14] transition duration-300 hover:bg-[#77D4E2] hover:shadow-[0_0_10px_rgba(30,200,230,0.3)]"
          >
            Save Rule
          </button>

        </div>
      </div>

    </div>
  )
}

export default RuleEditor