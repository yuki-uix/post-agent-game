import type { RoundResult } from "../App"

type Props = {
  results: RoundResult[]
  onRestart: () => void
}

export default function Summary({ results, onRestart }: Props) {
  const total = results.length
  const tripleMatches = results.filter(r => r.tripleMatch).length
  const aiPlayerMatches = results.filter(r => r.aiPlayerMatch).length
  const playerLabelMatches = results.filter(r => r.playerLabelMatch).length
  const disputes = results.filter(r => !r.tripleMatch && !r.aiPlayerMatch).length

  // most interesting: player and AI disagree AND labeled differs too
  const mostInteresting = results.filter(r => !r.tripleMatch && !r.aiPlayerMatch)

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-10">
      <div className="max-w-lg w-full space-y-6">

        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-gray-900">本局结算</div>
          <p className="text-gray-500 text-sm">共 {total} 条工单</p>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "三方一致", value: tripleMatches, desc: "意图明确，无争议", color: "text-teal-600" },
            { label: "你与 AI 一致", value: aiPlayerMatches, desc: "含三方一致场景", color: "text-blue-600" },
            { label: "你与标注一致", value: playerLabelMatches, desc: "你的判断与数据集吻合", color: "text-gray-700" },
            { label: "三方分歧", value: disputes, desc: "最值得讨论的工单", color: "text-amber-600" },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-sm font-medium text-gray-700 mt-1">{item.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* dispute breakdown */}
        {mostInteresting.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">三方分歧的工单</div>
            {mostInteresting.map((r, i) => (
              <div key={i} className="bg-white border border-amber-200 rounded-xl p-4 space-y-2">
                <p className="text-gray-800 text-sm">「{r.ticket.message_zh}」</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-gray-100 rounded-full px-3 py-1 text-gray-600">
                    你：{r.playerIntent}
                  </span>
                  <span className="bg-gray-100 rounded-full px-3 py-1 text-gray-600">
                    AI：{r.aiIntent}
                  </span>
                  <span className="bg-gray-100 rounded-full px-3 py-1 text-gray-600">
                    标注：{r.labeledIntent}
                  </span>
                </div>
                {r.ticket.note && (
                  <p className="text-xs text-gray-500 leading-relaxed pt-1 border-t border-gray-100">
                    {r.ticket.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-gray-900 text-gray-200 rounded-2xl p-5 text-sm leading-relaxed">
          三方不一致的工单，不代表谁的判断「错了」——它说明这条工单的意图本身就是模糊的。
          这正是 AI 不该自动执行、而应该先交给人判断的场景。
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-gray-900 text-white rounded-xl py-4 text-base font-medium hover:bg-gray-700 transition-colors"
        >
          再来一局 →
        </button>
      </div>
    </div>
  )
}
