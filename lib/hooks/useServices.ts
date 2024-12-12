'use client'

import React, { createContext, useContext, useState } from 'react'
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"

const bedrock = new BedrockRuntimeClient({ 
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
  }
})
interface AgentiveResponse {
  suggestions: string[]
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  entities: string[]
  keyPhrases: string[]
}

enum ServiceType {
  CONTENT = 'CONTENT',
  ARTWORK = 'ARTWORK'
}

interface ServiceContextType {
  generateAIContent: (prompt: string, type: ServiceType) => Promise<AgentiveResponse>
  generateArtwork: (prompt: string) => Promise<string>
  loading: boolean
  error: string | null
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

export const ServiceProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateAIContent = async (prompt: string, type: ServiceType): Promise<AgentiveResponse> => {
    try {
      setLoading(true)
      
      const input = {
        prompt: `\n\nHuman: ${prompt}\n\nAssistant: Let me help you with that.`,
        max_tokens_to_sample: 2048,
        temperature: 0.7,
        top_k: 250,
        top_p: 0.999,
        stop_sequences: ["\n\nHuman:"],
        anthropic_version: "bedrock-2023-05-31"
      }

      const command = new InvokeModelCommand({
        modelId: "anthropic.claude-v2",
        body: JSON.stringify(input),
        contentType: "application/json",
        accept: "application/json"
      })

      const response = await bedrock.send(command)
      const responseBody = Buffer.from(response.body).toString('utf-8')
      const result = JSON.parse(responseBody)

      return {
        suggestions: result.completion.split('\n').filter(Boolean),
        sentiment: result.completion.toLowerCase().includes('positive') ? 'POSITIVE' : 
                  result.completion.toLowerCase().includes('negative') ? 'NEGATIVE' : 'NEUTRAL',
        entities: result.completion.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [],
        keyPhrases: result.completion.match(/"([^"]+)"/g)?.map((p: string) => p.replace(/"/g, '')) || []
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('AI generation failed')
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const generateArtwork = async (prompt: string): Promise<string> => {
    try {
      setLoading(true)
      
      const input = {
        prompt: `\n\nHuman: Generate album artwork: ${prompt}\n\nAssistant: Let me help with that design.`,
        max_tokens_to_sample: 2048,
        temperature: 0.9,
        top_k: 250,
        top_p: 0.999,
        stop_sequences: ["\n\nHuman:"],
        anthropic_version: "bedrock-2023-05-31"
      }

      const command = new InvokeModelCommand({
        modelId: "anthropic.claude-v2",
        body: JSON.stringify(input),
        contentType: "application/json",
        accept: "application/json"
      })

      const response = await bedrock.send(command)
      const responseBody = Buffer.from(response.body).toString('utf-8')
      const result = JSON.parse(responseBody)

      return result.completion
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Artwork generation failed')
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    generateAIContent,
    generateArtwork,
    loading,
    error
  }

  return React.createElement(ServiceContext.Provider, { value }, children)
}

export function useServices(): ServiceContextType {
  const context = useContext(ServiceContext)
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider')
  }
  return context
} 