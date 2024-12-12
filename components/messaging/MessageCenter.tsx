'use client'

import { useState } from 'react'
import { useMessaging } from '@/lib/hooks/useMessaging'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, UserPlus } from 'lucide-react'
import { NewConversationDialog } from './NewConversationDialog'

export function MessageCenter() {
  const { conversations, activeChat, sendMessage, setActiveChat, loading } = useMessaging()
  const [newMessage, setNewMessage] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChat) return

    try {
      await sendMessage(activeChat, newMessage)
      setNewMessage('')
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[600px]">
      {/* Conversation List */}
      <Card className="col-span-4 border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-[#00FF9F]">Messages</CardTitle>
          <Button
            onClick={() => setShowNewChat(true)}
            className="bg-[#FF6B6B] hover:bg-[#4CC9F0]"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {Object.entries(conversations).map(([userId, messages]) => {
              const lastMessage = messages[messages.length - 1]
              return (
                <div
                  key={userId}
                  onClick={() => setActiveChat(userId)}
                  className={`p-3 mb-2 cursor-pointer rounded ${
                    activeChat === userId ? 'bg-[#120458]' : 'hover:bg-[#120458]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={lastMessage.sender.profilePicture} />
                      <AvatarFallback>{userId[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#00FF9F] truncate">{userId}</p>
                      <p className="text-sm text-[#FF00E6] truncate">
                        {lastMessage.messageBody}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="col-span-8 border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
        {activeChat ? (
          <>
            <CardHeader>
              <CardTitle className="text-xl text-[#00FF9F]">{activeChat}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[500px]">
              <ScrollArea className="flex-1 pr-4">
                {conversations[activeChat]?.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.senderId === activeChat ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded ${
                        message.senderId === activeChat
                          ? 'bg-[#120458] text-white'
                          : 'bg-[#FF6B6B] text-white'
                      }`}
                    >
                      <p>{message.messageBody}</p>
                      <span className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <form onSubmit={handleSend} className="flex gap-2 mt-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-[#120458] text-white border-[#00FF9F]"
                />
                <Button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="bg-[#FF6B6B] hover:bg-[#4CC9F0]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[#00FF9F]">
            Select a conversation to start messaging
          </div>
        )}
      </Card>

      <NewConversationDialog
        open={showNewChat}
        onClose={() => setShowNewChat(false)}
      />
    </div>
  )
} 