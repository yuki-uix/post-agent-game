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
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) throw new Error("未配置 VITE_DEEPSEEK_API_KEY")

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 256,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    }),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    const detail = (errBody as { error?: { message?: string } }).error?.message ?? ""
    throw new Error(`API 请求失败 (${res.status})${detail ? `：${detail}` : ""}`)
  }

  const data = await res.json()
  const text: string = data.choices?.[0]?.message?.content ?? ""

  const parsed = JSON.parse(text) as ClassifyResult
  if (!parsed.intent) throw new Error("API 返回格式异常")
  return parsed
}
