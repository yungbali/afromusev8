export interface ServicePurchase {
  service: 'marketing' | 'epk' | 'artwork' | 'advisor'
  plan: string
  data: Record<string, string>
}

export interface ServiceComponentProps {
  onPurchase: (purchase: ServicePurchase) => void
}

export interface AIResponse {
  suggestions: string[]
  analysis: {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED'
    entities: string[]
    keyPhrases: string[]
  }
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  metadata?: {
    processingTime?: number
    modelUsed?: string
    confidence?: number
  }
} 