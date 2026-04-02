import { useState } from "react"
import type { Ticket } from "../types"

type Props = {
  ticket: Ticket
  index: number
  total: number
  intents: string[]
  onChoose: (intent: string) => Promise<void>
  isLoading?: boolean
  apiError?: string | null
  onRetry?: () => void
  onSkip?: () => void
}

const CATEGORY_LABEL: Record<string, string> = {
  clear: "意图明确",
  ambiguous: "意图模糊",
  emotional: "情绪激动",
}

const CATEGORY_COLOR: Record<string, string> = {
  clear: "bg-teal-50 text-teal-700 border-teal-200",
  ambiguous: "bg-amber-50 text-amber-700 border-amber-200",
  emotional: "bg-red-50 text-red-700 border-red-200",
}

export default function TicketRound({
  ticket, index, total, intents, onChoose,
  isLoading = false, apiError = null, onRetry, onSkip,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleChoose = async (intent: string) => {
    if (isLoading) return
    setSelected(intent)
    await onChoose(intent)
  }

  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-start px-6 py-10">
      <div className="max-w-lg w-full space-y-6">

        {/* progress */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>第 {index + 1} / {total} 条</span>
          <span className={`text-xs border rounded-full px-3 py-1 ${CATEGORY_COLOR[ticket.category]}`}>
            {CATEGORY_LABEL[ticket.category]}
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-gray-800 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((index) / total) * 100}%` }}
          />
        </div>

        {/* ticket */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">
            客户消息
          </div>
          <p className="text-gray-900 text-lg leading-relaxed font-medium">
            「{ticket.message_zh}」
          </p>
        </div>

        {/* AI status — smooth expand/collapse to avoid layout jitter */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isLoading || apiError ? "max-h-40" : "max-h-0"}`}>
          {isLoading && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
              <svg className="animate-spin h-4 w-4 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-gray-500">AI 正在判断，通常需要 3–5 秒…</span>
            </div>
          )}

          {apiError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 space-y-3">
              <p className="text-sm text-red-700">AI 判断失败：{apiError}</p>
              <div className="flex gap-2">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="flex-1 py-2 rounded-lg border border-red-300 text-red-700 text-sm hover:bg-red-100 transition-colors"
                  >
                    重试
                  </button>
                )}
                {onSkip && (
                  <button
                    onClick={onSkip}
                    className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                  >
                    跳过（使用默认值）
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* intent choices */}
        <div>
          <div className="text-sm text-gray-500 mb-3">你判断这条工单的意图是？</div>
          <div className="grid grid-cols-2 gap-2">
            {intents.map(intent => (
              <button
                key={intent}
                onClick={() => handleChoose(intent)}
                disabled={isLoading || !!apiError}
                className={`w-full text-center px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
                  ${selected === intent
                    ? "bg-gray-900 text-white border-gray-900 cursor-default"
                    : (isLoading || !!apiError)
                      ? "bg-white text-gray-400 border-gray-100 opacity-40 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                  }
                `}
              >
                {isLoading && selected === intent ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <svg className="animate-spin h-3.5 w-3.5 text-white shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    AI 判断中…
                  </span>
                ) : intent}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
