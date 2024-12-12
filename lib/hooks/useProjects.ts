'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { generateClient } from 'aws-amplify/api'
import { useAuthenticator } from '@aws-amplify/ui-react'

const client = generateClient()

// GraphQL operations
const listProjects = /* GraphQL */ `
  query ListProjects($filter: ModelProjectFilterInput) {
    listProjects(filter: $filter) {
      items {
        id
        name
        description
        status
        timeline {
          created
          updated
          deadline
        }
        serviceType
        messages {
          id
          sender
          content
          timestamp
        }
      }
    }
  }
`

const createProjectMutation = /* GraphQL */ `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      status
      timeline {
        created
        updated
        deadline
      }
      serviceType
    }
  }
`

const updateProjectMutation = /* GraphQL */ `
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      id
      status
      timeline {
        updated
      }
    }
  }
`

const deleteProjectMutation = /* GraphQL */ `
  mutation DeleteProject($input: DeleteProjectInput!) {
    deleteProject(input: $input) {
      id
    }
  }
`

const addMessageMutation = /* GraphQL */ `
  mutation AddMessage($input: AddMessageInput!) {
    addMessage(input: $input) {
      id
      messages {
        id
        sender
        content
        timestamp
      }
    }
  }
`

interface Project {
  id: string
  name: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  timeline: {
    created: string
    updated: string
    deadline?: string
  }
  serviceType: 'marketing' | 'epk' | 'artwork' | 'advisor'
  messages: {
    id: string
    sender: string
    content: string
    timestamp: string
  }[]
}

interface ProjectContextType {
  projects: Project[]
  loading: boolean
  error: string | null
  createProject: (data: Omit<Project, 'id' | 'timeline' | 'messages'>) => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  addMessage: (projectId: string, content: string) => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthenticator()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const response = await client.graphql({
        query: listProjects,
        variables: {
          filter: {
            userId: { eq: user?.username }
          }
        }
      })
      if ('data' in response && response.data?.listProjects) {
        setProjects(response.data.listProjects.items)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (data: Omit<Project, 'id' | 'timeline' | 'messages'>) => {
    try {
      const response = await client.graphql({
        query: createProjectMutation,
        variables: {
          input: {
            ...data,
            userId: user?.username,
            timeline: {
              created: new Date().toISOString(),
              updated: new Date().toISOString()
            }
          }
        }
      })
      if ('data' in response) {
        setProjects(prev => [...prev, response.data.createProject])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
      throw err
    }
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
      await client.graphql({
        query: updateProjectMutation,
        variables: {
          input: {
            id,
            ...data,
            timeline: {
              updated: new Date().toISOString()
            }
          }
        }
      })
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
      throw err
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await client.graphql({
        query: deleteProjectMutation,
        variables: { input: { id } }
      })
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
      throw err
    }
  }

  const addMessage = async (projectId: string, content: string) => {
    try {
      const response = await client.graphql({
        query: addMessageMutation,
        variables: {
          input: {
            projectId,
            sender: user?.username,
            content,
            timestamp: new Date().toISOString()
          }
        }
      })
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, messages: 'data' in response ? response.data?.addMessage?.messages : p.messages }
          : p
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add message')
      throw err
    }
  }
  return {
    projects,
    loading,
    error,
    createProject,
      updateProject,
      deleteProject,
      addMessage
    }
    return {
      projects,
      loading,
      error,
      createProject,
      updateProject,
      deleteProject,
      addMessage
    }
  }

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider')
  }
  return context
} 