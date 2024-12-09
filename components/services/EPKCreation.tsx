'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from 'lucide-react'

type ServicePurchase = {
  service: 'marketing' | 'epk' | 'artwork' | 'advisor'
  plan: string
  cost: number
  data: Record<string, string>
}

type EPKCreationProps = {
  onPurchase: (purchase: ServicePurchase) => boolean
}

export function EPKCreation({ onPurchase }: EPKCreationProps) {
  const [showForm, setShowForm] = useState(false)
  const [plan, setPlan] = useState<'basic' | 'premium' | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const success = onPurchase({
      service: 'epk',
      plan: plan || 'basic',
      cost: plan === 'basic' ? 75 : 150,
      data: {
        name: formData.get('name') as string,
        genre: formData.get('genre') as string,
        bio: formData.get('bio') as string,
        highlights: formData.get('highlights') as string
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
        <CardTitle className="text-2xl text-[#00FF9F]">EPK Creation</CardTitle>
        <CardDescription className="text-[#FF00E6]">Create your Electronic Press Kit</CardDescription>
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
              <FileText className="mr-2" />
              Basic EPK (75 Credits)
            </Button>
            <Button 
              className="w-full bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
              onClick={() => {
                setPlan('premium')
                setShowForm(true)
              }}
            >
              <FileText className="mr-2" />
              Premium EPK (150 Credits)
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              name="name"
              placeholder="Artist/Band Name"
              className="bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
            />
            <Input 
              name="genre"
              placeholder="Genre"
              className="bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
            />
            <Textarea 
              name="bio"
              placeholder="Bio"
              className="bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
            />
            <Textarea 
              name="highlights"
              placeholder="Career Highlights"
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
                Create {plan === 'basic' ? 'Basic' : 'Premium'} EPK
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
} 