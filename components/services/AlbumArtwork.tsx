'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon } from 'lucide-react'

type ServicePurchase = {
  service: 'marketing' | 'epk' | 'artwork' | 'advisor'
  plan: string
  cost: number
  data: Record<string, string>
}

type AlbumArtworkProps = {
  onPurchase: (purchase: ServicePurchase) => boolean
}

export function AlbumArtwork({ onPurchase }: AlbumArtworkProps) {
  const [showForm, setShowForm] = useState(false)
  const [plan, setPlan] = useState<'single' | 'album' | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const success = onPurchase({
      service: 'artwork',
      plan: plan || 'single',
      cost: plan === 'single' ? 60 : 120,
      data: {
        title: formData.get('title') as string,
        preferences: formData.get('preferences') as string,
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
        <CardTitle className="text-2xl text-[#00FF9F]">Album Artwork</CardTitle>
        <CardDescription className="text-[#FF00E6]">Professional cover art design</CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <div className="space-y-4">
            <Button 
              className="w-full bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
              onClick={() => {
                setPlan('single')
                setShowForm(true)
              }}
            >
              <ImageIcon className="mr-2" />
              Single Cover (60 Credits)
            </Button>
            <Button 
              className="w-full bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
              onClick={() => {
                setPlan('album')
                setShowForm(true)
              }}
            >
              <ImageIcon className="mr-2" />
              Album Cover (120 Credits)
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              name="title"
              placeholder="Project Title"
              className="bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
            />
            <Textarea 
              name="preferences"
              placeholder="Design Preferences (colors, style, mood, references)"
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
                Order {plan === 'single' ? 'Single' : 'Album'} Cover
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
} 