export type ServiceType = 'marketing' | 'epk' | 'artwork' | 'advisor'

export type ServicePurchase = {
  service: ServiceType
  plan: string
  cost: number
  data: Record<string, string>
}

export type ProjectStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'

export type Project = {
  id: number
  name: string
  description: string
  status: ProjectStatus
  timeline: {
    created: Date
    updated: Date
    deadline?: Date
  }
  serviceType: ServiceType
  data: Record<string, string>
} 