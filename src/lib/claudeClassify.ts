const INTENTS = [
  "取消订单", "修改订单", "申请退款", "咨询退款政策",
  "投诉", "查询物流", "查询退款进度", "咨询取消费用",
  "咨询配送时效", "转人工客服", "其他"
]

const SYSTEM_PROMPT = `你是一个电商售后工单意图分类系统。分析客户消息，从以下意图中选择最匹配的一个：
${INTENTS.join("、")}

只返回JSON，不要有任何其他内容，格式：
{"intent": "取消订单", "confidence": 0.94, "reason": "一句话说明判断依据"}`

export type ClassifyResult = {
  intent: string
  confidence: number
  reason: string
}

export async function claudeClassify(message: string): Promise<ClassifyResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("未配置 VITE_ANTHROPIC_API_KEY")

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }],
    }),
  })

  if (!res.ok) throw new Error(`API 请求失败 (${res.status})`)

  const data = await res.json()
  const text: string = data.content?.find(
    (b: { type: string }) => b.type === "text"
  )?.text ?? ""

  const parsed = JSON.parse(text) as ClassifyResult
  if (!parsed.intent) throw new Error("API 返回格式异常")
  return parsed
}
