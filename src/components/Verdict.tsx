import type { RoundResult } from "../types"

type Props = {
  result: RoundResult
  onNext: () => void
}

export default function Verdict({ result, onNext }: Props) {
  const { ticket, playerIntent, aiIntent, aiConfidence, aiReason, labeledIntent, tripleMatch, aiPlayerMatch } = result

  const confidencePct = Math.round(aiConfidence * 100)

  const getMatchStatus = () => {
    if (tripleMatch) return { label: "三方一致", color: "text-teal-600 bg-teal-50 border-teal-200" }
    if (aiPlayerMatch) return { label: "你与 AI 一致，但标注不同", color: "text-blue-600 bg-blue-50 border-blue-200" }
    return { label: "三方出现分歧", color: "text-amber-600 bg-amber-50 border-amber-200" }
  }

  const status = getMatchStatus()

  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-start px-6 py-10">
      <div className="max-w-lg w-full space-y-6">

        <div className="text-center space-y-2">
          <div className={`inline-flex text-sm font-medium border rounded-full px-4 py-1.5 ${status.color}`}>
            {status.label}
          </div>
        </div>

        {/* ticket replay */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
          <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">工单</div>
          <p className="text-gray-700 text-sm leading-relaxed">「{ticket.message_zh}」</p>
        </div>

        {/* three-way comparison */}
        <div className="space-y-3">
          {[
            {
              role: "你的判断",
              intent: playerIntent,
              sub: null,
              highlight: playerIntent !== labeledIntent && playerIntent !== aiIntent,
              color: "border-gray-300 bg-white",
            },
            {
              role: "AI 判断",
              intent: aiIntent,
              sub: `置信度 ${confidencePct}% · ${aiReason}`,
              highlight: aiIntent !== labeledIntent && aiIntent !== playerIntent,
              color: "border-gray-300 bg-white",
            },
            {
              role: "数据标注",
              intent: labeledIntent,
              sub: "Bitext 数据集原始标签",
              highlight: false,
              color: "border-gray-200 bg-gray-50",
            },
          ].map(item => (
            <div
              key={item.role}
              className={`rounded-xl border px-5 py-4 ${item.color}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">{item.role}</div>
                  <div className={`font-semibold text-base ${item.highlight ? "text-amber-600" : "text-gray-900"}`}>
                    {item.intent}
                  </div>
                  {item.sub && (
                    <div className="text-xs text-gray-400 mt-1">{item.sub}</div>
                  )}
                </div>
                {tripleMatch && (
                  <span className="text-teal-500 text-lg mt-0.5">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* design note */}
        {ticket.note && (
          <div className="bg-gray-900 text-gray-100 rounded-2xl p-5">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">设计思考</div>
            <p className="text-sm leading-relaxed text-gray-200">{ticket.note}</p>
          </div>
        )}

        {!ticket.note && tripleMatch && (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
            <p className="text-teal-700 text-sm">
              这是一条意图明确的工单，三方判断一致。真正有趣的分歧在模糊和情绪类工单里。
            </p>
          </div>
        )}

        <button
          onClick={onNext}
          className="w-full bg-gray-900 text-white rounded-xl py-4 text-base font-medium hover:bg-gray-700 transition-colors"
        >
          下一条 →
        </button>
      </div>
    </div>
  )
}
