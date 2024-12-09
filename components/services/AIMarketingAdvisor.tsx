'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare } from 'lucide-react'

type ServicePurchase = {
  service: 'marketing' | 'epk' | 'artwork' | 'advisor'
  plan: string
  cost: number
  data: Record<string, string>
}

type AIMarketingAdvisorProps = {
  onPurchase: (purchase: ServicePurchase) => boolean
}

export function AIMarketingAdvisor({ onPurchase }: AIMarketingAdvisorProps) {
  const [showForm, setShowForm] = useState(false)
  const [plan, setPlan] = useState<'basic' | 'deep' | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const success = onPurchase({
      service: 'advisor',
      plan: plan || 'basic',
      cost: plan === 'basic' ? 40 : 80,
      data: {
        name: formData.get('name') as string,
        challenges: formData.get('challenges') as string,
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
        <CardTitle className="text-2xl text-[#00FF9F]">AI Marketing Advisor</CardTitle>
        <CardDescription className="text-[#FF00E6]">Get AI-powered marketing insights</CardDescription>
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
              <MessageSquare className="mr-2" />
              Basic Analysis (40 Credits)
            </Button>
            <Button 
              className="w-full bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
              onClick={() => {
                setPlan('deep')
                setShowForm(true)
              }}
            >
              <MessageSquare className="mr-2" />
              Deep Analysis (80 Credits)
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              name="name"
              placeholder="Artist/Project Name"
              className="bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
            />
            <Textarea 
              name="challenges"
              placeholder="Current Marketing Challenges"
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
                Get {plan === 'basic' ? 'Basic' : 'Deep'} Analysis
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
} 