type Props = { onStart: () => void }

export default function Intro({ onStart }: Props) {
  return (
    <div className="animate-fade-in min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center space-y-8">

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 border border-gray-200 rounded-full px-4 py-1.5">
            售后 Agent 挑战
          </div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            人类判官<br />
            <span className="text-gray-400">vs</span><br />
            AI 判官
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            每局随机抽取 10 条真实售后工单<br />
            你和 AI 各自判断客户意图<br />
            结算时对比「你的判断 · AI · 数据标注」三方差异
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "意图明确", desc: "建立基准", card: "bg-gray-50 border-gray-200", title: "text-gray-800", sub: "text-gray-500" },
            { label: "意图模糊", desc: "开始分歧", card: "bg-amber-50 border-amber-200", title: "text-amber-800", sub: "text-amber-600" },
            { label: "情绪激动", desc: "最难判断", card: "bg-red-50 border-red-200", title: "text-red-800", sub: "text-red-600" },
          ].map(item => (
            <div key={item.label} className={`rounded-xl p-3 border ${item.card}`}>
              <div className={`font-medium text-sm ${item.title}`}>{item.label}</div>
              <div className={`text-xs mt-0.5 ${item.sub}`}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-left">
          <p className="text-amber-800 text-sm leading-relaxed">
            <span className="font-semibold">提示：</span>这个游戏没有唯一正确答案。
            AI 的判断不一定对，数据标注也不一定对。
            有趣的地方在于三方不一致的时候——那才是值得思考的工单。
          </p>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-gray-900 text-white rounded-xl py-4 text-base font-medium hover:bg-gray-700 active:bg-gray-800 transition-colors cursor-pointer"
        >
          开始挑战 →
        </button>
      </div>
    </div>
  )
}
