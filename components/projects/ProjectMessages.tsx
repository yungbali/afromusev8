'use client'

import { useState } from 'react'
import { useProjects } from '@/lib/hooks/useProjects'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface ProjectMessagesProps {
  projectId: string
  open: boolean
  onClose: () => void
}

export function ProjectMessages({ projectId, open, onClose }: ProjectMessagesProps) {
  const { projects, addMessage, loading } = useProjects()
  const [newMessage, setNewMessage] = useState('')

  const project = projects.find(p => p.id === projectId)
  if (!project) return null

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !projectId) return

    try {
      await addMessage(projectId, newMessage)
      setNewMessage('')
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2D0E75] border-4 border-[#00FF9F] rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#00FF9F]">{project.name} - Messages</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {project.messages.map((message) => (
              <div
                key={message.id}
                className="p-3 rounded bg-[#120458] border-2 border-[#00FF9F]"
              >
                <div className="flex justify-between text-sm text-[#FF00E6] mb-1">
                  <span>{message.sender}</span>
                  <span>{new Date(message.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-white">{message.content}</p>
              </div>
            ))}
          </div>
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
      </DialogContent>
    </Dialog>
  )
} 