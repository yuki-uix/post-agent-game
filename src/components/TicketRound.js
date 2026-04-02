import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
const CATEGORY_LABEL = {
    clear: "意图明确",
    ambiguous: "意图模糊",
    emotional: "情绪激动",
};
const CATEGORY_COLOR = {
    clear: "bg-teal-50 text-teal-700 border-teal-200",
    ambiguous: "bg-amber-50 text-amber-700 border-amber-200",
    emotional: "bg-red-50 text-red-700 border-red-200",
};
export default function TicketRound({ ticket, index, total, intents, onChoose }) {
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleChoose = async (intent) => {
        if (loading)
            return;
        setSelected(intent);
        setLoading(true);
        await onChoose(intent);
    };
    return (_jsx("div", { className: "animate-fade-in min-h-screen flex flex-col items-center justify-start px-6 py-10", children: _jsxs("div", { className: "max-w-lg w-full space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between text-sm text-gray-400", children: [_jsxs("span", { children: ["\u7B2C ", index + 1, " / ", total, " \u6761"] }), _jsx("span", { className: `text-xs border rounded-full px-3 py-1 ${CATEGORY_COLOR[ticket.category]}`, children: CATEGORY_LABEL[ticket.category] })] }), _jsx("div", { className: "w-full bg-gray-100 rounded-full h-1.5", children: _jsx("div", { className: "bg-gray-800 h-1.5 rounded-full transition-all duration-300", style: { width: `${((index) / total) * 100}%` } }) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm", children: [_jsx("div", { className: "text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider", children: "\u5BA2\u6237\u6D88\u606F" }), _jsxs("p", { className: "text-gray-900 text-lg leading-relaxed font-medium", children: ["\u300C", ticket.message_zh, "\u300D"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm text-gray-500 mb-3", children: "\u4F60\u5224\u65AD\u8FD9\u6761\u5DE5\u5355\u7684\u610F\u56FE\u662F\uFF1F" }), intents.map(intent => (_jsx("button", { onClick: () => handleChoose(intent), disabled: loading, className: `w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all
                ${selected === intent
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"}
                ${loading && selected !== intent ? "opacity-40 cursor-not-allowed" : ""}
              `, children: intent }, intent)))] }), loading && (_jsx("div", { className: "text-center text-gray-400 text-sm animate-pulse py-2", children: "AI \u6B63\u5728\u5224\u65AD\u4E2D\u2026" }))] }) }));
}
