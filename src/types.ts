export type Ticket = {
  id: string
  message_zh: string
  category: "clear" | "ambiguous" | "emotional"
  labeled_intent_zh: string
  note: string
}

export type RoundResult = {
  ticket: Ticket
  playerIntent: string
  aiIntent: string
  aiConfidence: number
  aiReason: string
  labeledIntent: string
  tripleMatch: boolean
  aiPlayerMatch: boolean
  playerLabelMatch: boolean
}
