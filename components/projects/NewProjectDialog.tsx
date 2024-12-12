'use client'

import { useState } from 'react'
import { useProjects } from '@/lib/hooks/useProjects'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface NewProjectDialogProps {
  open: boolean
  onClose: () => void
}

export function NewProjectDialog({ open, onClose }: NewProjectDialogProps) {
  const { createProject, loading } = useProjects()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceType: '' as 'marketing' | 'epk' | 'artwork' | 'advisor'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProject({
        ...formData,
        status: 'pending'
      })
      onClose()
      setFormData({ name: '', description: '', serviceType: '' as 'marketing' })
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#2D0E75] border-4 border-[#00FF9F] rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#00FF9F]">Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-[#120458] text-white border-[#00FF9F]"
          />
          <Textarea
            placeholder="Project Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-[#120458] text-white border-[#00FF9F]"
          />
          <Select
            value={formData.serviceType}
            onValueChange={(value) => setFormData({ ...formData, serviceType: value as any })}
          >
            <SelectTrigger className="bg-[#120458] text-white border-[#00FF9F]">
              <SelectValue placeholder="Select Service Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#2D0E75] border-[#00FF9F]">
              <SelectItem value="marketing">Marketing Plan</SelectItem>
              <SelectItem value="epk">EPK Creation</SelectItem>
              <SelectItem value="artwork">Album Artwork</SelectItem>
              <SelectItem value="advisor">AI Marketing Advisor</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#00FF9F] text-[#00FF9F]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#FF6B6B] hover:bg-[#4CC9F0] text-white"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 