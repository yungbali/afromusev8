'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { ScrollArea } from './scroll-area'
import { Button } from './button'
import { Textarea } from './textarea'
import { useServices } from '@/lib/hooks/useServices'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ServiceChatProps {
  serviceType: 'marketing' | 'epk' | 'artwork' | 'advisor'
  systemPrompt: string
}

export function ServiceChat({ serviceType, systemPrompt }: ServiceChatProps) {
  const { generateAIContent, loading } = useServices()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsStreaming(true)

    try {
      let streamedContent = ''
      
      await generateAIContent(
        `${systemPrompt}\n\nUser: ${input}\n\nAssistant:`,
        serviceType,
        {
          onStart: () => setIsStreaming(true),
          onToken: (token) => {
            streamedContent += token
            setMessages(prev => [
              ...prev.slice(0, -1),
              { role: 'assistant', content: streamedContent }
            ])
          },
          onComplete: () => setIsStreaming(false),
          onError: (error) => {
            console.error('Chat error:', error)
            setMessages(prev => [
              ...prev,
              { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
            ])
          }
        }
      )
    } catch (error) {
      console.error('Chat error:', error)
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
      <CardHeader>
        <CardTitle className="text-2xl text-[#00FF9F]">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-[#120458] ml-8'
                    : 'bg-[#4CC9F0] mr-8'
                }`}
              >
                <p className={`${message.role === 'user' ? 'text-[#00FF9F]' : 'text-white'}`}>
                  {message.content}
                </p>
              </div>
            ))}
            {isStreaming && (
              <div className="bg-[#4CC9F0] p-4 rounded-lg mr-8">
                <p className="text-white">Thinking...</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[80px] bg-[#120458] text-[#00FF9F] border-2 border-[#00FF9F]"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white self-end"
          >
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 