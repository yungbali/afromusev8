'use client'

import { createContext, useContext, useState, useEffect, type ReactNode, Dispatch, SetStateAction } from 'react'
import { generateClient } from 'aws-amplify/api'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { GraphQLQuery, GraphQLSubscription } from '@aws-amplify/api'

const client = generateClient()

interface Message {
  id: string
  senderId: string
  receiverId: string
  messageBody: string
  timestamp: string
  sender: {
    username: string
    profilePicture?: string
  }
}

interface AgenticMessage extends Message {
  priority: 'high' | 'medium' | 'low'
  category: 'collaboration' | 'project' | 'marketing' | 'support'
  aiSuggestions?: {
    nextActions: string[]
    relatedProjects: string[]
    resourceLinks: string[]
  }
}

interface MessagingContextType {
  conversations: { [userId: string]: Message[] }
  activeChat: string | null
  loading: boolean
  error: string | null
  sendMessage: (receiverId: string, message: string) => Promise<void>
  setActiveChat: Dispatch<SetStateAction<string | null>>
  loadMoreMessages: (userId: string) => Promise<void>
}

interface ListMessagesResponse {
  listMessages: {
    items: Message[]
  }
}

interface CreateMessageResponse {
  createMessage: Message
}

interface OnCreateMessageResponse {
  onCreateMessage: Message
}

// GraphQL operations
const listMessages = /* GraphQL */ `
  query ListMessages($filter: ModelMessageFilterInput) {
    listMessages(filter: $filter) {
      items {
        id
        senderId
        receiverId
        messageBody
        timestamp
        sender {
          username
          profilePicture
        }
      }
    }
  }
`

const createMessage = /* GraphQL */ `
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      senderId
      receiverId
      messageBody
      timestamp
      sender {
        username
        profilePicture
      }
    }
  }
`

const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onCreateMessage(filter: $filter) {
      id
      senderId
      receiverId
      messageBody
      timestamp
      sender {
        username
        profilePicture
      }
    }
  }
`

// Create the context with proper typing
const MessagingContext = createContext<MessagingContextType | null>(null)

interface MessagingProviderProps {
  children: ReactNode
}

export function MessagingProvider({ children }: MessagingProviderProps) {
  const { user } = useAuthenticator()
  const [conversations, setConversations] = useState<{ [userId: string]: Message[] }>({})
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadMessages()
      const unsubscribe = subscribeToMessages()
      return () => {
        unsubscribe()
      }
    }
  }, [user])

  const loadMessages = async () => {
    if (!user?.username) return

    setLoading(true)
    try {
      const response = await client.graphql<GraphQLQuery<ListMessagesResponse>>({
        query: listMessages,
        variables: {
          filter: {
            or: [
              { senderId: { eq: user.username } },
              { receiverId: { eq: user.username } }
            ]
          }
        }
      })

      const messages = response.data?.listMessages.items ?? []
      const groupedMessages = messages.reduce((acc, message) => {
        const otherUserId = message.senderId === user.username ? 
          message.receiverId : message.senderId
        return {
          ...acc,
          [otherUserId]: [...(acc[otherUserId] || []), message].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        }
      }, {} as { [userId: string]: Message[] })

      setConversations(groupedMessages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMessages = () => {
    if (!user?.username) return () => {}

    const subscription = client.graphql<GraphQLSubscription<OnCreateMessageResponse>>({
      query: onCreateMessage,
      variables: {
        filter: {
          or: [
            { senderId: { eq: user.username } },
            { receiverId: { eq: user.username } }
          ]
        }
      }
    }).subscribe({
      next: ({ data }) => {
        if (!data?.onCreateMessage) return
        const newMessage = data.onCreateMessage
        setConversations(prev => {
          const otherUserId = newMessage.senderId === user.username ? 
            newMessage.receiverId : newMessage.senderId
          return {
            ...prev,
            [otherUserId]: [...(prev[otherUserId] || []), newMessage].sort(
              (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            )
          }
        })
      },
      error: (err) => console.error('Subscription error:', err)
    })

    return () => subscription.unsubscribe()
  }

  const sendMessage = async (receiverId: string, messageBody: string) => {
    if (!user?.username) throw new Error('User not authenticated')

    try {
      await client.graphql<GraphQLQuery<CreateMessageResponse>>({
        query: createMessage,
        variables: {
          input: {
            senderId: user.username,
            receiverId,
            messageBody,
            timestamp: new Date().toISOString()
          }
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      throw err
    }
  }

  const loadMoreMessages = async (userId: string) => {
    // Implement pagination logic here
    console.log('Loading more messages for', userId)
  }

  const contextValue: MessagingContextType = {
    conversations,
    activeChat,
    loading,
    error,
    sendMessage,
    setActiveChat,
    loadMoreMessages
  }
  return contextValue;
}

export function useMessaging(): MessagingContextType {
  const context = useContext(MessagingContext)
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider')
  }
  return context
}

export { MessagingContext } 