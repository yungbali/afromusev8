'use client'

import { useProjects } from '@/lib/hooks/useProjects'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlusCircle, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { NewProjectDialog } from './NewProjectDialog'
import { ProjectMessages } from './ProjectMessages'

const STATUS_COLORS = {
  pending: 'bg-yellow-500',
  'in-progress': 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500'
}

export function ProjectList() {
  const { projects, loading } = useProjects()
  const [showNewProject, setShowNewProject] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  if (loading) {
    return <div className="text-center">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#00FF9F]">Your Projects</h2>
        <Button 
          onClick={() => setShowNewProject(true)}
          className="bg-[#FF6B6B] hover:bg-[#4CC9F0]"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="border-4 border-[#00FF9F] rounded-none bg-[#2D0E75]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-[#00FF9F]">{project.name}</CardTitle>
              <Badge className={`${STATUS_COLORS[project.status]} text-white`}>
                {project.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-4">{project.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#FF00E6]">
                  Created: {new Date(project.timeline.created).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProject(project.id)}
                  className="border-[#00FF9F] text-[#00FF9F]"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Messages ({project.messages.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewProjectDialog 
        open={showNewProject} 
        onClose={() => setShowNewProject(false)} 
      />

      {selectedProject && (
        <ProjectMessages
          projectId={selectedProject}
          open={true}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  )
} 