import { useState } from 'react'

type RuleEditorProps = {
  onRuleSaved: () => void
}

function RuleEditor({ onRuleSaved }: RuleEditorProps) {
  const [rule, setRule] = useState(
    `alert tcp any any -> any 22 (
  msg:"SSH connection detected";
  sid:100001;
  rev:1;
)`
  )

  const [validation, setValidation] = useState<{
    valid: boolean
    message?: string
    error?: string
  } | null>(null)

  const [validating, setValidating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const lines = rule.split('\n')

  const validateRule = async () => {
    setValidating(true)
    setValidation(null)
    setSaveMessage(null)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/rules/validate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rule: rule,
          }),
        }
      )

      const data = await response.json()

      setValidation(data)
    } catch {
      setValidation({
        valid: false,
        error: 'Unable to contact AEGIS backend',
      })
    } finally {
      setValidating(false)
    }
  }

  const saveRule = async () => {
    if (!validation?.valid) {
      setSaveMessage('Rule must be validated first')
      return
    }

    setSaving(true)
    setSaveMessage(null)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/rules',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rule: rule,
            enabled: true,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Failed to save rule'
        )
      }

      setSaveMessage('Rule saved successfully')

      // Tell App.tsx that a new rule has been saved.
      // App.tsx will then ask RulesCard to refresh.
      onRuleSaved()
    } catch {
      setSaveMessage('Unable to save rule')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#101522] transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.12)]">

      {/* LEFT ACCENT */}

      <div className="absolute left-0 top-0 h-full w-[2px] bg-[#7C3AED] opacity-70" />

      <div className="p-6">

        {/* HEADER */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/10 text-lg text-[#22D3EE]">
              &gt;_
            </div>

            <div>
              <p className="text-sm font-semibold tracking-wide">
                Rule Editor
              </p>

              <p className="mt-1 text-[11px] uppercase tracking-wider text-[#8B95A7]">
                Suricata signature
              </p>
            </div>

          </div>

          <span className="rounded-md border border-[#34D399]/20 bg-[#34D399]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#34D399]">
            RULE
          </span>

        </div>

        {/* EDITOR */}

        <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.06] bg-[#080B14]">

          {/* EDITOR HEADER */}

          <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0C111D] px-4 py-2">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-[#34D399]" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8B95A7]">
                AEGIS RULE TERMINAL
              </span>

            </div>

            <span className="font-mono text-[9px] text-[#8B95A7]">
              SURICATA
            </span>

          </div>

          {/* CODE AREA */}

          <div className="flex min-h-[250px]">

            {/* LINE NUMBERS */}

            <div className="select-none border-r border-white/[0.04] bg-[#0A0F19] px-3 py-4 text-right font-mono text-[11px] leading-6 text-[#4B5563]">

              {lines.map((_, index) => (
                <div key={index}>
                  {index + 1}
                </div>
              ))}

            </div>

            {/* TEXTAREA */}

            <textarea
              value={rule}
              onChange={event => {
                setRule(event.target.value)
                setValidation(null)
                setSaveMessage(null)
              }}
              spellCheck={false}
              className="min-h-[250px] flex-1 resize-none bg-transparent px-4 py-4 font-mono text-[12px] leading-6 text-[#F1F5F9] outline-none placeholder:text-[#4B5563]"
              placeholder="Write a Suricata rule..."
            />

          </div>

        </div>

        {/* VALIDATION RESULT */}

        {validation && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 ${
              validation.valid
                ? 'border-[#34D399]/20 bg-[#34D399]/10'
                : 'border-red-500/20 bg-red-500/10'
            }`}
          >

            <p
              className={`text-[11px] font-semibold ${
                validation.valid
                  ? 'text-[#34D399]'
                  : 'text-red-400'
              }`}
            >
              {validation.valid
                ? validation.message || 'Rule is valid'
                : validation.error || 'Rule is invalid'}
            </p>

          </div>
        )}

        {/* SAVE MESSAGE */}

        {saveMessage && (
          <div className="mt-3">

            <p
              className={`text-[11px] ${
                saveMessage === 'Rule saved successfully'
                  ? 'text-[#34D399]'
                  : 'text-red-400'
              }`}
            >
              {saveMessage}
            </p>

          </div>
        )}

        {/* FOOTER */}

        <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">

          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#8B95A7]">
              Detection engine
            </p>

            <p className="mt-1 text-xs font-medium text-[#F1F5F9]">
              Suricata
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* VALIDATE */}

            <button
              onClick={validateRule}
              disabled={validating}
              className="rounded-lg border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#A78BFA] transition-all hover:border-[#7C3AED]/60 hover:bg-[#7C3AED]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {validating
                ? 'Validating...'
                : 'Validate'}
            </button>

            {/* SAVE */}

            <button
              onClick={saveRule}
              disabled={saving || !validation?.valid}
              className="rounded-lg border border-[#34D399]/30 bg-[#34D399]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#34D399] transition-all hover:border-[#34D399]/60 hover:bg-[#34D399]/20 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {saving
                ? 'Saving...'
                : 'Save Rule'}
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default RuleEditor