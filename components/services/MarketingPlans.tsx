'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ServicePurchase = {
  service: 'marketing' | 'epk' | 'artwork' | 'advisor'
  plan: string
  cost: number
  data: Record<string, string>
}

type MarketingPlansProps = {
  onPurchase: (purchase: ServicePurchase) => boolean
}

export function MarketingPlans({ onPurchase }: MarketingPlansProps) {
  const [showForm, setShowForm] = useState(false)
  const [plan, setPlan] = useState<'basic' | 'pro' | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const success = onPurchase({
      service: 'marketing',
      plan: plan || 'basic',
      cost: plan === 'basic' ? 50 : 100,
      data: {
        title: formData.get('title') as string,
        goals: formData.get('goals') as string,
      }
    })
    if (success) {
      setShowForm(false)
      setPlan(null)
    }
  }

  return (
    <Card className="relative overflow-hidden border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
      <CardHeader>
        <CardTitle className="text-2xl text-[#00FF9F]">Marketing Plans</CardTitle>
        <CardDescription className="text-[#FF00E6]">Promote your music effectively</CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <div className="space-y-4">
            <Button 
              className="w-full bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
              onClick={() => {
                setPlan('basic')
                setShowForm(true)
              }}
            >
              Basic Plan (50 Credits)
            </Button>
            <Button 
              className="w-full bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
              onClick={() => {
                setPlan('pro')
                setShowForm(true)
              }}
            >
              Pro Plan (100 Credits)
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="Song/Album Title"
              className="bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
            />
            <Textarea 
              placeholder="Marketing Goals"
              className="bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
            />
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
              >
                Purchase {plan === 'basic' ? 'Basic' : 'Pro'} Plan
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
} 