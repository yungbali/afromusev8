'use client'

import { useState } from 'react'
import { useServices, AgentiveResponse } from '@/lib/hooks/useServices'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ServiceChat } from '@/components/ui/ServiceChat'
import { ServiceComponentProps } from '@/types/services'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ADVISOR_PLANS = [
  {
    name: 'Basic Analysis',
    credits: 40,
    features: [
      'Social Media Performance',
      'Audience Demographics',
      'Basic Recommendations',
      'Monthly Report'
    ],
    analysisType: 'BASIC'
  },
  {
    name: 'Deep Analysis',
    credits: 80,
    features: [
      'Everything in Basic',
      'Competitor Analysis',
      'Trend Predictions',
      'Custom Strategy',
      'Weekly Reports',
      'Priority Support'
    ],
    analysisType: 'DEEP'
  }
]

const MARKETING_SYSTEM_PROMPT = `You are an AI Marketing Advisor specialized in music industry marketing. 
Your role is to provide strategic marketing advice, analyze trends, and help artists promote their music effectively. 
Please provide detailed, actionable insights and maintain a professional yet friendly tone.`

export function AIMarketingAdvisor({ onPurchase }: ServiceComponentProps) {
  const { generateAIContent, loading, error } = useServices()
  const [prompt, setPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState<AgentiveResponse | null>(null)

  const handleAnalysis = async (plan: typeof ADVISOR_PLANS[0]) => {
    try {
      const result = await generateAIContent(prompt, 'advisor')
      setAiResponse(result)
      
      onPurchase({
        service: 'advisor',
        plan: plan.name,
        cost: plan.credits,
        data: {
          analysisType: plan.analysisType,
          prompt,
          suggestions: result.suggestions.join(', '),
          sentiment: result.sentiment,
          keyPhrases: result.keyPhrases.join(', ')
        }
      })
    } catch (err) {
      console.error('Analysis error:', err)
    }
  }

  return (
    <Tabs defaultValue="analysis" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="analysis">Analysis</TabsTrigger>
        <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
      </TabsList>
      
      <TabsContent value="analysis" className="space-y-6">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your marketing goals..."
          className="min-h-[100px] bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
        />
        
        <div className="grid gap-6 md:grid-cols-2">
          {ADVISOR_PLANS.map((plan) => (
            <Card key={plan.name} className="border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#00FF9F]">{plan.name}</CardTitle>
                <CardDescription className="text-[#FF00E6]">
                  {plan.credits} Credits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white">
                  {plan.features.map((feature: string) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleAnalysis(plan)}
                  disabled={loading || !prompt}
                  className="mt-4 w-full bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
                >
                  {loading ? 'Analyzing...' : `Analyze (${plan.credits} Credits)`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {aiResponse && (
          <Card className="border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00FF9F]">AI Analysis</CardTitle>
              <CardDescription className="text-[#FF00E6]">
                Sentiment: {aiResponse.sentiment}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2">Suggestions:</h4>
                  <ul className="list-disc pl-5">
                    {aiResponse.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">Key Phrases:</h4>
                  <ul className="list-disc pl-5">
                    {aiResponse.keyPhrases.map((phrase: string, index: number) => (
                      <li key={index}>{phrase}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Entities:</h4>
                  <ul className="list-disc pl-5">
                    {aiResponse.entities.map((entity: string, index: number) => (
                      <li key={index}>{entity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="text-red-500 mt-2">
            {error}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="chat">
        <ServiceChat 
          serviceType="advisor"
          systemPrompt={MARKETING_SYSTEM_PROMPT}
        />
      </TabsContent>
    </Tabs>
  )
} 