import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Verdict({ result, onNext }) {
    const { ticket, playerIntent, aiIntent, aiConfidence, aiReason, labeledIntent, tripleMatch, aiPlayerMatch } = result;
    const confidencePct = Math.round(aiConfidence * 100);
    const getMatchStatus = () => {
        if (tripleMatch)
            return { label: "三方一致", color: "text-teal-600 bg-teal-50 border-teal-200" };
        if (aiPlayerMatch)
            return { label: "你与 AI 一致，但标注不同", color: "text-blue-600 bg-blue-50 border-blue-200" };
        return { label: "三方出现分歧", color: "text-amber-600 bg-amber-50 border-amber-200" };
    };
    const status = getMatchStatus();
    return (_jsxs("div", { className: "animate-fade-in min-h-screen flex flex-col items-center justify-start px-6 py-10", children: [_jsxs("div", { className: "max-w-lg w-full space-y-6", children: [_jsx("div", { className: "text-center space-y-2", children: _jsx("div", { className: `inline-flex text-sm font-medium border rounded-full px-4 py-1.5 ${status.color}`, children: status.label }) }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-5", children: [_jsx("div", { className: "text-xs text-gray-400 mb-2 uppercase tracking-wider", children: "\u5DE5\u5355" }), _jsxs("p", { className: "text-gray-700 text-sm leading-relaxed", children: ["\u300C", ticket.message_zh, "\u300D"] })] }), _jsx("div", { className: "space-y-3", children: [
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
                        ].map(item => (_jsx("div", { className: `rounded-xl border px-5 py-4 ${item.color}`, children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-400 mb-1", children: item.role }), _jsx("div", { className: `font-semibold text-base ${item.highlight ? "text-amber-600" : "text-gray-900"}`, children: item.intent }), item.sub && (_jsx("div", { className: "text-xs text-gray-400 mt-1", children: item.sub }))] }), tripleMatch && (_jsx("span", { className: "text-teal-500 text-lg mt-0.5", children: "\u2713" }))] }) }, item.role))) }), ticket.note && (_jsxs("div", { className: "bg-gray-900 text-gray-100 rounded-2xl p-5", children: [_jsx("div", { className: "text-xs text-gray-400 mb-2 uppercase tracking-wider", children: "\u8BBE\u8BA1\u601D\u8003" }), _jsx("p", { className: "text-sm leading-relaxed text-gray-200", children: ticket.note })] })), !ticket.note && tripleMatch && (_jsx("div", { className: "bg-teal-50 border border-teal-200 rounded-2xl p-5", children: _jsx("p", { className: "text-teal-700 text-sm", children: "\u8FD9\u662F\u4E00\u6761\u610F\u56FE\u660E\u786E\u7684\u5DE5\u5355\uFF0C\u4E09\u65B9\u5224\u65AD\u4E00\u81F4\u3002\u771F\u6B63\u6709\u8DA3\u7684\u5206\u6B67\u5728\u6A21\u7CCA\u548C\u60C5\u7EEA\u7C7B\u5DE5\u5355\u91CC\u3002" }) }))] }), _jsx("div", { className: "sticky bottom-0 w-full max-w-lg px-6 pb-6 pt-3 bg-gradient-to-t from-white via-white to-transparent", children: _jsx("button", { onClick: onNext, className: "w-full bg-gray-900 text-white rounded-xl py-4 text-base font-medium hover:bg-gray-700 transition-colors shadow-lg", children: "\u4E0B\u4E00\u6761 \u2192" }) })] }));
}
