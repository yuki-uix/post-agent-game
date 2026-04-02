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

        {/* intent choices */}
        <div className="space-y-2">
          <div className="text-sm text-gray-500 mb-3">你判断这条工单的意图是？</div>
          {intents.map(intent => (
            <button
              key={intent}
              onClick={() => handleChoose(intent)}
              disabled={isLoading}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all
                ${selected === intent
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }
                ${isLoading && selected !== intent ? "opacity-40 cursor-not-allowed" : ""}
              `}
            >
              {intent}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center text-gray-400 text-sm animate-pulse py-2">
            AI 正在判断中…
          </div>
        )}

        {apiError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
            <p className="text-sm text-red-700 font-medium">⚠️ {apiError}</p>
            <div className="flex gap-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  重试
                </button>
              )}
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  跳过
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
