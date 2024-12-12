'use client'

import { ServiceComponentProps } from '@/types/services'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ServiceChat } from '@/components/ui/ServiceChat'

const ARTWORK_PLANS = [
  {
    name: 'Single Cover',
    credits: 60,
    features: [
      '3000x3000px High Resolution',
      '2 Revision Rounds',
      'Social Media Formats',
      'Commercial License'
    ],
    dimensions: '3000x3000px'
  },
  {
    name: 'Album Cover',
    credits: 120,
    features: [
      '3000x3000px High Resolution',
      'Unlimited Revisions',
      'All Digital Formats',
      'Physical Format Templates',
      'Commercial License',
      'Source Files'
    ],
    dimensions: '3000x3000px'
  }
]

const ARTWORK_SYSTEM_PROMPT = `You are an AI Art Director specialized in album cover design. 
Your role is to provide guidance on visual aesthetics, help artists develop their visual identity, 
and suggest design elements that align with their music style. 
Please provide detailed visual descriptions and maintain a creative yet professional tone.`

export function AlbumArtwork({ onPurchase }: ServiceComponentProps) {
  const handlePurchase = async (plan: typeof ARTWORK_PLANS[0]) => {
    onPurchase({
      service: 'artwork',
      plan: plan.name,
      cost: plan.credits,
      data: { dimensions: plan.dimensions }
    })
  }

  return (
    <Tabs defaultValue="designs" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="designs">Designs</TabsTrigger>
        <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
      </TabsList>
      
      <TabsContent value="designs">
        <div className="grid gap-6 md:grid-cols-2">
          {ARTWORK_PLANS.map((plan) => (
            <Card key={plan.name} className="border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#00FF9F]">{plan.name}</CardTitle>
                <CardDescription className="text-[#FF00E6]">
                  {plan.credits} Credits | {plan.dimensions}
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
                  className="mt-4 w-full bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
                >
                  Design Cover ({plan.credits} Credits)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="chat">
        <ServiceChat 
          serviceType="artwork"
          systemPrompt={ARTWORK_SYSTEM_PROMPT}
        />
      </TabsContent>
    </Tabs>
  )
} 