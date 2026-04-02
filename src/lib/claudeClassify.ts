export type ClassifyResult = {
  intent: string
  confidence: number
  reason: string
}

export async function claudeClassify(message: string): Promise<ClassifyResult> {
  const res = await fetch('/api/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    const detail = (errBody as { error?: string }).error ?? ''
    throw new Error(`API 请求失败 (${res.status})${detail ? `：${detail}` : ''}`)
  }

  const parsed = await res.json() as ClassifyResult
  if (!parsed.intent) throw new Error('API 返回格式异常')
  return parsed
}
