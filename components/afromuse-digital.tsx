'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Star } from 'lucide-react'
import { Pixelify_Sans } from 'next/font/google'
import Image from 'next/image'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { AuthenticatorWrapper } from './auth/AuthenticatorWrapper'

import { MarketingPlans } from './services/MarketingPlans'
import { EPKCreation } from './services/EPKCreation'
import { AlbumArtwork } from './services/AlbumArtwork'
import { AIMarketingAdvisor } from './services/AIMarketingAdvisor'
import { IMAGES } from '@/lib/constants'

const pixelifySans = Pixelify_Sans({ subsets: ['latin'] })

type ServicePurchase = {
  service: 'marketing' | 'epk' | 'artwork' | 'advisor'
  plan: string
  cost: number
  data: Record<string, string>
}

type CreditTransaction = {
  id: number
  type: 'purchase' | 'usage'
  amount: number
  description: string
  date: Date
}

type ProjectStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'

type Project = {
  id: number
  name: string
  description: string
  status: ProjectStatus
  timeline: {
    created: Date
    updated: Date
    deadline?: Date
  }
  files?: {
    name: string
    url: string
    type: string
  }[]
  messages: {
    id: number
    sender: string
    content: string
    timestamp: Date
  }[]
  serviceType: 'marketing' | 'epk' | 'artwork' | 'advisor'
  data: Record<string, string>
}

export function AfromuseDigitalComponent() {
  const { user, signOut } = useAuthenticator()
  const [screen, setScreen] = useState<'onboarding' | 'dashboard'>('onboarding')
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [credits, setCredits] = useState(250)
  const [showFeedback, setShowFeedback] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [messages, setMessages] = useState<Array<{ id: number; sender: string; content: string }>>([
    { id: 1, sender: 'System', content: 'Welcome to Afromuse Digital! How can we assist you today?' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [creditHistory, setCreditHistory] = useState<CreditTransaction[]>([])

  const onboardingSteps = [
    {
      title: "Welcome to Afromuse Digital",
      description: "Let's get you set up to amplify your music to the world!",
      action: "Next"
    },
    {
      title: "Tell us about yourself",
      description: "What best describes you?",
      options: ["Solo Artist", "Band", "Producer", "Manager"],
      action: "Continue"
    },
    {
      title: "Your goals",
      description: "What are you looking to achieve?",
      options: ["Grow my audience", "Release new music", "Book more gigs", "Improve my brand"],
      action: "Finish"
    }
  ]

  const handleOnboardingNext = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      setScreen('dashboard')
    }
  }

  useEffect(() => {
    try {
      return () => {
        document.body.style.backgroundImage = 'none'
      }
    } catch (err) {
      console.error('Error setting background:', err)
      setError('Failed to set background image')
    }
  }, [])

  const handleServicePurchase = (purchase: ServicePurchase) => {
    if (credits >= purchase.cost) {
      // Create new project
      const newProject: Project = {
        id: Date.now(),
        name: `${purchase.service} - ${purchase.plan}`,
        description: `${purchase.plan} plan for ${purchase.service}`,
        status: 'pending',
        timeline: {
          created: new Date(),
          updated: new Date(),
        },
        messages: [],
        serviceType: purchase.service,
        data: purchase.data
      }
      
      // Handle credit transaction
      handleCreditTransaction('usage', purchase.cost, `Purchase ${purchase.service} ${purchase.plan} plan`)
      setProjects(prev => [...prev, newProject])
      return true
    }
    setError("Not enough credits!")
    return false
  }

  const purchaseCredits = (amount: number) => {
    setCredits(credits + amount)
    alert(`${amount} credits purchased!`)
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        sender: 'User',
        content: newMessage.trim(),
      }
      setMessages([...messages, userMessage])
      setNewMessage('')

      // Simulate a response from the system
      setTimeout(() => {
        const systemResponse = {
          id: Date.now() + 1,
          sender: 'System',
          content: 'Thank you for your message. Our team will get back to you soon!',
        }
        setMessages(prevMessages => [...prevMessages, systemResponse])
      }, 1000)
    } else {
      setError("Please enter a message before sending")
    }
  }

  const handleCreditTransaction = (type: 'purchase' | 'usage', amount: number, description: string) => {
    const transaction: CreditTransaction = {
      id: Date.now(),
      type,
      amount,
      description,
      date: new Date()
    }
    setCreditHistory(prev => [...prev, transaction])
    setCredits(prev => type === 'purchase' ? prev + amount : prev - amount)
  }

  const handleSignOut = () => {
    signOut()
  }

  // Get user name safely
  const userName = user?.username || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#120458] text-[#00FF9F]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => setError(null)} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AuthenticatorWrapper>
      <div className={`min-h-screen bg-[#120458] text-[#00FF9F] ${pixelifySans.className}`}>
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,.1) 50%, transparent 50%), linear-gradient(90deg, rgba(0,0,0,.1) 50%, transparent 50%)',
          backgroundSize: '4px 4px',
          mixBlendMode: 'multiply',
        }} />
        {screen === 'onboarding' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-2 text-center">
                <Image
                  src={IMAGES.logo}
                  alt="Afromuse Digital Logo"
                  width={80}
                  height={80}
                  priority
                  className="mx-auto mb-4"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <h1 className="text-2xl font-semibold text-[#00FF9F]">{onboardingSteps[onboardingStep].title}</h1>
                <p className="text-[#FF00E6]">{onboardingSteps[onboardingStep].description}</p>
              </div>
              {onboardingSteps[onboardingStep].options && (
                <div className="grid grid-cols-2 gap-4">
                  {onboardingSteps[onboardingStep].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
              <Button
                className="w-full bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white font-bold px-4 py-2 rounded-none border-2 border-[#00FF9F]"
                size="lg"
                onClick={handleOnboardingNext}
              >
                {onboardingSteps[onboardingStep].action}
              </Button>
              <Progress value={(onboardingStep + 1) * (100 / onboardingSteps.length)} className="w-full" />
            </div>
          </div>
        )}

        {screen === 'dashboard' && (
          <div className="container mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-[#00FF9F]">Welcome to Musette</h1>
                <p className="text-xl text-[#FF00E6]">Empowering African creators worldwide</p>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 rounded-none border-2 border-[#00FF9F]">
                  <AvatarImage src={IMAGES.avatar} alt={userName} />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
              </div>
            </header>

            <Tabs defaultValue="services" className="space-y-6">
              <TabsList className="grid grid-cols-4 gap-4 bg-[#2D0E75] p-1 rounded-none">
                <TabsTrigger value="services" className="data-[state=active]:bg-[#FF6B6B] data-[state=active]:text-[#120458] rounded-none border-2 border-[#00FF9F]">Services</TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-[#FF6B6B] data-[state=active]:text-[#120458] rounded-none border-2 border-[#00FF9F]">Projects</TabsTrigger>
                <TabsTrigger value="credits" className="data-[state=active]:bg-[#FF6B6B] data-[state=active]:text-[#120458] rounded-none border-2 border-[#00FF9F]">Credits</TabsTrigger>
                <TabsTrigger value="profile" className="data-[state=active]:bg-[#FF6B6B] data-[state=active]:text-[#120458] rounded-none border-2 border-[#00FF9F]">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="services">
                <div className="grid gap-6 md:grid-cols-2">
                  <MarketingPlans onPurchase={handleServicePurchase} />
                  <EPKCreation onPurchase={handleServicePurchase} />
                  <AlbumArtwork onPurchase={handleServicePurchase} />
                  <AIMarketingAdvisor onPurchase={handleServicePurchase} />
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <Card className="relative overflow-hidden border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#00FF9F]">My Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.map(project => (
                        <Card key={project.id} className="bg-[#120458] border-2 border-[#00FF9F]">
                          <CardHeader>
                            <CardTitle className="text-[#00FF9F] flex justify-between">
                              {project.name}
                              <span className="text-sm bg-[#FF6B6B] px-2 py-1 rounded">
                                {project.status}
                              </span>
                            </CardTitle>
                            <CardDescription className="text-[#FF00E6]">
                              Created: {project.timeline.created.toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-[#FF00E6] mb-4">{project.description}</p>
                            {project.messages.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-[#00FF9F]">Latest Message:</h4>
                                <p className="text-[#FF00E6]">
                                  {project.messages[project.messages.length - 1].content}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="credits">
                <Card className="relative overflow-hidden border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#00FF9F]">Credit Balance</CardTitle>
                    <CardDescription className="text-[#FF00E6]">Manage your Afromuse Digital credits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-4xl font-bold text-[#00FF9F]">{credits} Credits</div>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        onClick={() => purchaseCredits(100)}
                        className="bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white font-bold px-4 py-2 rounded-none border-2 border-[#00FF9F]"
                      >
                        Buy 100 Credits
                      </Button>
                      <Button
                        onClick={() => purchaseCredits(500)}
                        className="bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white font-bold px-4 py-2 rounded-none border-2 border-[#00FF9F]"
                      >
                        Buy 500 Credits
                      </Button>
                      <Button
                        onClick={() => purchaseCredits(1000)}
                        className="bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white font-bold px-4 py-2 rounded-none border-2 border-[#00FF9F]"
                      >
                        Buy 1000 Credits
                      </Button>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-xl text-[#00FF9F] mb-4">Transaction History</h3>
                      <div className="space-y-2">
                        {creditHistory.map(transaction => (
                          <div key={transaction.id} className="flex justify-between items-center p-2 border-b border-[#00FF9F]">
                            <div>
                              <p className="text-[#00FF9F]">{transaction.description}</p>
                              <p className="text-sm text-[#FF00E6]">{transaction.date.toLocaleDateString()}</p>
                            </div>
                            <p className={transaction.type === 'purchase' ? 'text-green-500' : 'text-red-500'}>
                              {transaction.type === 'purchase' ? '+' : '-'}{transaction.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <Card className="relative overflow-hidden border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#00FF9F]">My Profile</CardTitle>
                    <CardDescription className="text-[#FF00E6]">Manage your account and messages</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 rounded-none border-2 border-[#00FF9F]">
                        <AvatarImage src={IMAGES.avatar} alt="User" />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold text-[#00FF9F]">User Name</h3>
                        <p className="text-[#FF00E6]">user@example.com</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-[#00FF9F]">Messages</h4>
                      <div className="h-64 overflow-y-auto space-y-2 p-2 bg-[#120458] border-2 border-[#00FF9F]">
                        {messages.map(message => (
                          <div key={message.id} className={`p-2 rounded-lg ${message.sender === 'User' ? 'bg-[#FF6B6B] ml-auto' : 'bg-[#4CC9F0]'} max-w-[80%]`}>
                            <p className="text-[#120458] font-semibold">{message.sender}</p>
                            <p className="text-white">{message.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
                      />
                      <Button
                        onClick={sendMessage}
                        className="bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white font-bold px-4 py-2 rounded-none border-2 border-[#00FF9F]"
                      >
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#00FF9F]">Success Stories</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <TestimonialCard
                  name="Teepsoul Entertainment"
                  quote="Afromuse Digital helped us reach a global audience we never thought possible!"
                  image={IMAGES.placeholder}
                  rating={5}
                />
                <TestimonialCard
                  name="Aisha M."
                  quote="The AI Marketing Advisor gave me insights that boosted my streams by 200%!"
                  image={IMAGES.placeholder}
                  rating={5}
                />
              </div>
            </section>

            <Button 
              className="w-full md:w-auto bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white font-bold px-4 py-2 rounded-none border-2 border-[#00FF9F]"
              onClick={() => setShowFeedback(true)}
            >
              Share Your Feedback
            </Button>

            {showFeedback && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md relative overflow-hidden border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
                  <CardHeader>
                    <CardTitle>Share Your Experience</CardTitle>
                    <CardDescription>Help us improve Afromuse Digital</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <textarea 
                      className="w-full h-32 p-2 rounded bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
                      placeholder="Tell us about your experience..."
                    />
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowFeedback(false)}>Cancel</Button>
                      <Button className="bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white font-bold px-4 py-2 rounded-none border-2 border-[#00FF9F]">
                        Submit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthenticatorWrapper>
  )
}

function TestimonialCard({ name, quote, image, rating }: { name: string, quote: string, image: string, rating: number }) {
  return (
    <Card className="overflow-hidden border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16 rounded-none border-2 border-[#00FF9F]">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-[#00FF9F]">{name}</h3>
            <div className="flex">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#FF6B6B] text-[#FF6B6B]" />
              ))}
            </div>
          </div>
        </div>
        <p className="text-[#FF00E6] italic">&ldquo;{quote}&rdquo;</p>
      </CardContent>
      <div className="h-2 bg-gradient-to-r from-[#FF6B6B] to-[#4CC9F0]" />
    </Card>
  )
}