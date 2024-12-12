'use client'

import { useServices } from '@/lib/hooks/useServices'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ServiceComponentProps } from '@/types/services'

const EPK_PLANS = [
  {
    name: 'Basic EPK',
    credits: 75,
    features: [
      'Artist Bio',
      'Press Photos',
      'Music Links',
      'Basic Press Kit PDF'
    ],
    outputFormat: 'PDF'
  },
  {
    name: 'Premium EPK',
    credits: 150,
    features: [
      'Everything in Basic',
      'Custom Web Design',
      'Video Integration',
      'Social Media Kit',
      'Analytics Dashboard'
    ],
    outputFormat: 'Web + PDF'
  }
]

export function EPKCreation({ onPurchase }: ServiceComponentProps) {
  const { purchaseService, loading, error } = useServices()

  const handlePurchase = async (plan: typeof EPK_PLANS[0]) => {
    onPurchase({
      service: 'epk',
      plan: plan.name,
      cost: plan.credits,
      data: { outputFormat: plan.outputFormat }
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {EPK_PLANS.map((plan) => (
        <Card key={plan.name} className="border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#00FF9F]">{plan.name}</CardTitle>
            <CardDescription className="text-[#FF00E6]">
              {plan.credits} Credits | {plan.outputFormat}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-white">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button
              onClick={() => handlePurchase(plan)}
              disabled={loading}
              className="mt-4 w-full bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
            >
              {loading ? 'Processing...' : `Create EPK (${plan.credits} Credits)`}
            </Button>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 