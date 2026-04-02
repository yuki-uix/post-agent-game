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
export default function TicketRound({ ticket, index, total, intents, onChoose, isLoading = false, apiError = null, onRetry, onSkip, }) {
    const [selected, setSelected] = useState(null);
    const handleChoose = async (intent) => {
        if (isLoading)
            return;
        setSelected(intent);
        await onChoose(intent);
    };
    return (_jsx("div", { className: "animate-fade-in min-h-screen flex flex-col items-center justify-start px-6 py-10", children: _jsxs("div", { className: "max-w-lg w-full space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between text-sm text-gray-400", children: [_jsxs("span", { children: ["\u7B2C ", index + 1, " / ", total, " \u6761"] }), _jsx("span", { className: `text-xs border rounded-full px-3 py-1 ${CATEGORY_COLOR[ticket.category]}`, children: CATEGORY_LABEL[ticket.category] })] }), _jsx("div", { className: "w-full bg-gray-100 rounded-full h-1.5", children: _jsx("div", { className: "bg-gray-800 h-1.5 rounded-full transition-all duration-300", style: { width: `${((index) / total) * 100}%` } }) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm", children: [_jsx("div", { className: "text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider", children: "\u5BA2\u6237\u6D88\u606F" }), _jsxs("p", { className: "text-gray-900 text-lg leading-relaxed font-medium", children: ["\u300C", ticket.message_zh, "\u300D"] })] }), _jsxs("div", { className: `overflow-hidden transition-all duration-300 ease-in-out ${isLoading || apiError ? "max-h-40" : "max-h-0"}`, children: [isLoading && (_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200", children: [_jsxs("svg", { className: "animate-spin h-4 w-4 text-gray-500 shrink-0", viewBox: "0 0 24 24", fill: "none", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" })] }), _jsx("span", { className: "text-sm text-gray-500", children: "AI \u6B63\u5728\u5224\u65AD\uFF0C\u901A\u5E38\u9700\u8981 3\u20135 \u79D2\u2026" })] })), apiError && (_jsxs("div", { className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 space-y-3", children: [_jsxs("p", { className: "text-sm text-red-700", children: ["AI \u5224\u65AD\u5931\u8D25\uFF1A", apiError] }), _jsxs("div", { className: "flex gap-2", children: [onRetry && (_jsx("button", { onClick: onRetry, className: "flex-1 py-2 rounded-lg border border-red-300 text-red-700 text-sm hover:bg-red-100 transition-colors", children: "\u91CD\u8BD5" })), onSkip && (_jsx("button", { onClick: onSkip, className: "flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors", children: "\u8DF3\u8FC7\uFF08\u4F7F\u7528\u9ED8\u8BA4\u503C\uFF09" }))] })] }))] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500 mb-3", children: "\u4F60\u5224\u65AD\u8FD9\u6761\u5DE5\u5355\u7684\u610F\u56FE\u662F\uFF1F" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: intents.map(intent => (_jsx("button", { onClick: () => handleChoose(intent), disabled: isLoading || !!apiError, className: `w-full text-center px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
                  ${selected === intent
                                    ? "bg-gray-900 text-white border-gray-900 cursor-default"
                                    : (isLoading || !!apiError)
                                        ? "bg-white text-gray-400 border-gray-100 opacity-40 cursor-not-allowed"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"}
                `, children: isLoading && selected === intent ? (_jsxs("span", { className: "flex items-center justify-center gap-1.5", children: [_jsxs("svg", { className: "animate-spin h-3.5 w-3.5 text-white shrink-0", viewBox: "0 0 24 24", fill: "none", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" })] }), "AI \u5224\u65AD\u4E2D\u2026"] })) : intent }, intent))) })] })] }) }));
}
