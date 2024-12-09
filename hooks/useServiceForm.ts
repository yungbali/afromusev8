import { useState } from 'react'
import { ServiceType, ServicePurchase } from '@/types'

type UseServiceFormProps = {
  serviceType: ServiceType
  onPurchase: (purchase: ServicePurchase) => boolean
  plans: {
    id: string
    name: string
    cost: number
  }[]
}

export function useServiceForm({ serviceType, onPurchase, plans }: UseServiceFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!plan) return

    const formData = new FormData(e.target as HTMLFormElement)
    const formEntries = Object.fromEntries(formData.entries())
    
    const selectedPlan = plans.find(p => p.id === plan)
    if (!selectedPlan) return

    const success = onPurchase({
      service: serviceType,
      plan: selectedPlan.name,
      cost: selectedPlan.cost,
      data: formEntries as Record<string, string>
    })

    if (success) {
      setShowForm(false)
      setPlan(null)
    }
  }

  return {
    showForm,
    setShowForm,
    plan,
    setPlan,
    handleSubmit
  }
} 