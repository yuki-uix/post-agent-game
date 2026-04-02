import type { VercelRequest, VercelResponse } from '@vercel/node'

const INTENTS = [
  "取消订单", "修改订单", "申请退款", "咨询退款政策",
  "投诉", "查询物流", "查询退款进度", "咨询取消费用",
  "咨询配送时效", "转人工客服", "其他",
]

const SYSTEM_PROMPT = `你是一个电商售后工单意图分类系统。分析客户消息，从以下意图中选择最匹配的一个：
${INTENTS.join("、")}

只返回JSON，不要有任何其他内容，格式：
{"intent": "取消订单", "confidence": 0.94, "reason": "一句话说明判断依据"}`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'DEEPSEEK_API_KEY is not configured on the server' })
  }

  const { message } = req.body as { message?: string }
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Request body must include a "message" string' })
  }

  const upstream = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 256,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
    }),
  })

  if (!upstream.ok) {
    const errBody = await upstream.json().catch(() => ({}))
    const detail = (errBody as { error?: { message?: string } }).error?.message ?? ''
    return res.status(upstream.status).json({
      error: `DeepSeek API error (${upstream.status})${detail ? `: ${detail}` : ''}`,
    })
  }

  const data = await upstream.json()
  const text: string = data.choices?.[0]?.message?.content ?? ''

  try {
    const parsed = JSON.parse(text)
    if (!parsed.intent) throw new Error('missing intent field')
    return res.status(200).json(parsed)
  } catch {
    return res.status(500).json({ error: 'Invalid JSON response from DeepSeek' })
  }
}
