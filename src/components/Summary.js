import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
export default function Summary({ results, onRestart }) {
    const total = results.length;
    const tripleMatches = results.filter(r => r.tripleMatch).length;
    const aiPlayerMatches = results.filter(r => r.aiPlayerMatch).length;
    const playerLabelMatches = results.filter(r => r.playerLabelMatch).length;
    const disputes = results.filter(r => !r.tripleMatch && !r.aiPlayerMatch).length;
    const mostInteresting = results.filter(r => !r.tripleMatch && !r.aiPlayerMatch);
    const [expandedIds, setExpandedIds] = useState(new Set());
    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            }
            else {
                next.add(id);
            }
            return next;
        });
    };
    return (_jsx("div", { className: "animate-fade-in min-h-screen flex flex-col items-center justify-start px-6 py-10", children: _jsxs("div", { className: "max-w-lg w-full space-y-6", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("div", { className: "text-3xl font-bold text-gray-900", children: "\u672C\u5C40\u7ED3\u7B97" }), _jsxs("p", { className: "text-gray-500 text-sm", children: ["\u5171 ", total, " \u6761\u5DE5\u5355"] })] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                        { label: "三方一致", value: tripleMatches, desc: "意图明确，无争议", color: "text-teal-600" },
                        { label: "你与 AI 一致", value: aiPlayerMatches, desc: "含三方一致场景", color: "text-blue-600" },
                        { label: "你与标注一致", value: playerLabelMatches, desc: "你的判断与数据集吻合", color: "text-gray-700" },
                        { label: "三方分歧", value: disputes, desc: "最值得讨论的工单", color: "text-amber-600" },
                    ].map(item => (_jsxs("div", { className: "bg-gray-50 border border-gray-100 rounded-2xl p-4", children: [_jsx("div", { className: `text-3xl font-bold ${item.color}`, children: item.value }), _jsx("div", { className: "text-sm font-medium text-gray-700 mt-1", children: item.label }), _jsx("div", { className: "text-xs text-gray-400 mt-0.5", children: item.desc })] }, item.label))) }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "text-sm font-medium text-gray-700", children: "\u4E09\u65B9\u5206\u6B67\u7684\u5DE5\u5355" }), mostInteresting.length === 0 && (_jsx("div", { className: "bg-teal-50 border border-teal-200 rounded-xl p-4", children: _jsx("p", { className: "text-teal-700 text-sm text-center", children: "\u8FD9\u4E00\u5C40\u4E09\u65B9\u5224\u65AD\u9AD8\u5EA6\u4E00\u81F4\uFF01\u8BD5\u8BD5\u4E0B\u4E00\u5C40\uFF0C\u770B\u770B\u66F4\u591A\u6A21\u7CCA\u5DE5\u5355\u3002" }) })), mostInteresting.map((r) => {
                            const isExpanded = expandedIds.has(r.ticket.id);
                            return (_jsxs("div", { className: "bg-white border border-amber-200 rounded-xl p-4 space-y-2", children: [_jsxs("p", { className: "text-gray-800 text-sm leading-relaxed", children: ["\u300C", r.ticket.message_zh, "\u300D"] }), _jsxs("div", { className: "flex flex-wrap gap-2 text-xs", children: [_jsxs("span", { className: "bg-gray-100 rounded-full px-3 py-1 text-gray-600", children: ["\u4F60\uFF1A", r.playerIntent] }), _jsxs("span", { className: "bg-gray-100 rounded-full px-3 py-1 text-gray-600", children: ["AI\uFF1A", r.aiIntent] }), _jsxs("span", { className: "bg-gray-100 rounded-full px-3 py-1 text-gray-600", children: ["\u6807\u6CE8\uFF1A", r.labeledIntent] })] }), r.ticket.note && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => toggleExpand(r.ticket.id), className: "text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1 pt-1", children: isExpanded ? "收起 ▴" : "展开设计思考 ▾" }), _jsx("div", { className: `overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`, children: _jsx("p", { className: "text-xs text-gray-500 leading-relaxed pt-2 border-t border-gray-100", children: r.ticket.note }) })] }))] }, r.ticket.id));
                        })] }), _jsx("div", { className: "bg-gray-900 text-gray-200 rounded-2xl p-5 text-sm leading-relaxed", children: "AI \u610F\u56FE\u8BC6\u522B\u505A\u51FA\u5224\u65AD\u4E4B\u540E\uFF0C\u300C\u81EA\u52A8\u6267\u884C\u8FD8\u662F\u7B49\u5F85\u4EBA\u5DE5\u786E\u8BA4\u300D\u8FD9\u6761\u8FB9\u754C\u662F\u8BBE\u8BA1\u95EE\u9898\uFF0C\u4E0D\u662F\u6280\u672F\u95EE\u9898\u3002 \u4E09\u65B9\u4E0D\u4E00\u81F4\u7684\u5DE5\u5355\uFF0C\u6B63\u662F AI \u4E0D\u8BE5\u81EA\u52A8\u6267\u884C\u3001\u800C\u5E94\u8BE5\u5148\u4EA4\u7ED9\u4EBA\u5224\u65AD\u7684\u573A\u666F\u3002" }), _jsx("button", { onClick: onRestart, className: "w-full bg-gray-900 text-white rounded-xl py-4 text-base font-medium hover:bg-gray-700 transition-colors", children: "\u518D\u6765\u4E00\u5C40 \u2192" })] }) }));
}
