import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import ticketsData from "./data/tickets.json";
import TicketRound from "./components/TicketRound";
import Verdict from "./components/Verdict";
import Summary from "./components/Summary";
import Intro from "./components/Intro";
import { claudeClassify } from "./lib/claudeClassify";
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
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [pendingPlayerIntent, setPendingPlayerIntent] = useState(null);
    const startGame = useCallback(() => {
        setTickets(sampleTickets());
        setCurrentIndex(0);
        setResults([]);
        setPendingResult(null);
        setApiError(null);
        setPendingPlayerIntent(null);
        setPhase("playing");
    }, []);
    const handlePlayerChoice = useCallback(async (playerIntent) => {
        const ticket = tickets[currentIndex];
        setApiError(null);
        setIsLoading(true);
        setPendingPlayerIntent(playerIntent);
        try {
            const { intent, confidence, reason } = await claudeClassify(ticket.message_zh);
            const result = {
                ticket,
                playerIntent,
                aiIntent: intent,
                aiConfidence: confidence,
                aiReason: reason,
                labeledIntent: ticket.labeled_intent_zh,
                tripleMatch: playerIntent === intent && intent === ticket.labeled_intent_zh,
                aiPlayerMatch: playerIntent === intent,
                playerLabelMatch: playerIntent === ticket.labeled_intent_zh,
            };
            setPendingResult(result);
            setPhase("verdict");
        }
        catch (err) {
            setApiError(err instanceof Error ? err.message : "网络异常，请重试");
        }
        finally {
            setIsLoading(false);
        }
    }, [tickets, currentIndex]);
    const handleRetry = useCallback(() => {
        if (pendingPlayerIntent)
            handlePlayerChoice(pendingPlayerIntent);
    }, [pendingPlayerIntent, handlePlayerChoice]);
    const handleSkip = useCallback(() => {
        const ticket = tickets[currentIndex];
        const playerIntent = pendingPlayerIntent ?? "其他";
        const result = {
            ticket,
            playerIntent,
            aiIntent: "其他",
            aiConfidence: 0,
            aiReason: "API 调用失败，使用默认值",
            labeledIntent: ticket.labeled_intent_zh,
            tripleMatch: playerIntent === "其他" && ticket.labeled_intent_zh === "其他",
            aiPlayerMatch: playerIntent === "其他",
            playerLabelMatch: playerIntent === ticket.labeled_intent_zh,
        };
        setPendingResult(result);
        setApiError(null);
        setPendingPlayerIntent(null);
        setPhase("verdict");
    }, [tickets, currentIndex, pendingPlayerIntent]);
    const handleNext = useCallback(() => {
        if (!pendingResult)
            return;
        const newResults = [...results, pendingResult];
        setResults(newResults);
        setPendingResult(null);
        setApiError(null);
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
        return (_jsx(TicketRound, { ticket: tickets[currentIndex], index: currentIndex, total: ROUND_SIZE, intents: INTENTS, onChoose: handlePlayerChoice, isLoading: isLoading, apiError: apiError, onRetry: handleRetry, onSkip: handleSkip }, tickets[currentIndex].id));
    }
    if (phase === "verdict" && pendingResult) {
        return _jsx(Verdict, { result: pendingResult, onNext: handleNext }, `verdict-${currentIndex}`);
    }
    if (phase === "summary") {
        return _jsx(Summary, { results: results, onRestart: startGame }, "summary");
    }
    return null;
}
