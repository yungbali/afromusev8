'use client'

import { useServices } from '@/lib/hooks/useServices'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ServiceComponentProps, ServicePurchase } from '@/types/services'

const MARKETING_PLANS = [
  {
    name: 'Basic Plan',
    credits: 50,
    features: [
      'Social Media Strategy',
      'Content Calendar',
      'Basic Analytics'
    ]
  },
  {
    name: 'Pro Plan',
    credits: 100,
    features: [
      'Everything in Basic',
      'Advanced Analytics',
      'Competitor Analysis',
      'Paid Advertising Strategy'
    ]
  }
]

export function MarketingPlans({ onPurchase }: ServiceComponentProps) {
  const { purchaseService, loading, error } = useServices()

  const handlePurchase = async (plan: typeof MARKETING_PLANS[0]) => {
    try {
      await purchaseService('marketing', plan.credits)
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {MARKETING_PLANS.map((plan) => (
        <Card key={plan.name} className="border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#00FF9F]">{plan.name}</CardTitle>
            <CardDescription className="text-[#FF00E6]">{plan.credits} Credits</CardDescription>
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
              {loading ? 'Processing...' : `Purchase (${plan.credits} Credits)`}
            </Button>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 