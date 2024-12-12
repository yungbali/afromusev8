'use client'

import { useState } from 'react'
import { useMessaging } from '@/lib/hooks/useMessaging'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

interface NewConversationDialogProps {
  open: boolean
  onClose: () => void
}

export function NewConversationDialog({ open, onClose }: NewConversationDialogProps) {
  const [recipientId, setRecipientId] = useState('')
  const [message, setMessage] = useState('')
  const { sendMessage } = useMessaging()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientId || !message) return

    try {
      await sendMessage(recipientId, message)
      onClose()
      setRecipientId('')
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2D0E75] border-4 border-[#00FF9F] rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#00FF9F]">Start New Conversation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recipientId" className="block text-sm font-medium text-[#00FF9F]">
              Recipient ID
            </label>
            <input
              id="recipientId"
              type="text"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="mt-1 block w-full rounded-md bg-[#120458] text-white border-[#00FF9F] p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[#00FF9F]">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full rounded-md bg-[#120458] text-white border-[#00FF9F] p-2"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#FF6B6B] hover:bg-[#4CC9F0] px-4 py-2 text-white"
          >
            Send Message
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 