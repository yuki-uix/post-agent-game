import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import ticketsData from "./data/tickets.json";
import TicketRound from "./components/TicketRound";
import Verdict from "./components/Verdict";
import Summary from "./components/Summary";
import Intro from "./components/Intro";
const allTickets = ticketsData;
const INTENTS = [
    "取消订单", "修改订单", "申请退款", "咨询退款政策",
    "投诉", "查询物流", "查询退款进度", "咨询取消费用",
    "咨询配送时效", "转人工客服", "其他"
];
const ROUND_SIZE = 10;
function sampleTickets() {
    const shuffled = [...allTickets].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, ROUND_SIZE);
}
export default function App() {
    const [phase, setPhase] = useState("intro");
    const [tickets, setTickets] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [pendingResult, setPendingResult] = useState(null);
    const startGame = useCallback(() => {
        setTickets(sampleTickets());
        setCurrentIndex(0);
        setResults([]);
        setPendingResult(null);
        setPhase("playing");
    }, []);
    const handlePlayerChoice = useCallback(async (playerIntent) => {
        const ticket = tickets[currentIndex];
        // call Claude API
        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                system: `你是一个电商售后工单意图分类系统。分析客户消息，从以下意图中选择最匹配的一个：
${INTENTS.join("、")}

只返回JSON，不要有任何其他内容，格式：
{"intent": "取消订单", "confidence": 0.94, "reason": "一句话说明判断依据"}`,
                messages: [{ role: "user", content: ticket.message_zh }]
            })
        });
        const data = await res.json();
        let aiIntent = "其他";
        let aiConfidence = 0.5;
        let aiReason = "无法判断";
        try {
            const text = data.content?.find((b) => b.type === "text")?.text ?? "";
            const parsed = JSON.parse(text);
            aiIntent = parsed.intent ?? "其他";
            aiConfidence = parsed.confidence ?? 0.5;
            aiReason = parsed.reason ?? "";
        }
        catch {
            // keep defaults
        }
        const result = {
            ticket,
            playerIntent,
            aiIntent,
            aiConfidence,
            aiReason,
            labeledIntent: ticket.labeled_intent_zh,
            tripleMatch: playerIntent === aiIntent && aiIntent === ticket.labeled_intent_zh,
            aiPlayerMatch: playerIntent === aiIntent,
            playerLabelMatch: playerIntent === ticket.labeled_intent_zh,
        };
        setPendingResult(result);
        setPhase("verdict");
    }, [tickets, currentIndex]);
    const handleNext = useCallback(() => {
        if (!pendingResult)
            return;
        const newResults = [...results, pendingResult];
        setResults(newResults);
        setPendingResult(null);
        if (currentIndex + 1 >= ROUND_SIZE) {
            setPhase("summary");
        }
        else {
            setCurrentIndex(i => i + 1);
            setPhase("playing");
        }
    }, [pendingResult, results, currentIndex]);
    if (phase === "intro")
        return _jsx(Intro, { onStart: startGame }, "intro");
    if (phase === "playing" && tickets[currentIndex]) {
        return (_jsx(TicketRound, { ticket: tickets[currentIndex], index: currentIndex, total: ROUND_SIZE, intents: INTENTS, onChoose: handlePlayerChoice }, tickets[currentIndex].id));
    }
    if (phase === "verdict" && pendingResult) {
        return _jsx(Verdict, { result: pendingResult, onNext: handleNext }, `verdict-${currentIndex}`);
    }
    if (phase === "summary") {
        return _jsx(Summary, { results: results, onRestart: startGame }, "summary");
    }
    return null;
}
