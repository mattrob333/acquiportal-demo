export type ToolStatus = 'pending' | 'running' | 'success' | 'error'
export type AgentStatus = 'initializing' | 'working' | 'complete' | 'error'

export interface Subtask {
  id: string
  name: string
  status: 'pending' | 'running' | 'complete'
}

export interface ToolCall {
  id: string
  name: string
  displayName: string
  icon: string
  status: ToolStatus
  timestamp: Date
  duration: number | null
  input: Record<string, unknown>
  result: Record<string, unknown> | null
  error: string | null
  expanded: boolean
}

export interface AgentSpawn {
  id: string
  name: string
  task: string
  status: AgentStatus
  agentLevel: number
  timestamp: Date
  duration: number | null
  progress: {
    current: number
    total: number
  }
  subtasks: Subtask[]
  toolCalls: ToolCall[]
  childAgents: AgentSpawn[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  agentName?: string
  agentLevel: number
  toolCalls: ToolCall[]
  spawnedAgents: AgentSpawn[]
  isThinking: boolean
  isStreaming: boolean
  thinkingReasons?: string[]
}

export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  language?: string
  status: 'created' | 'modified' | 'pending'
  children?: FileItem[]
}

export type ModelType = 'opus' | 'sonnet' | 'haiku'
export type ToolConnectionStatus = 'connected' | 'needs-auth' | 'connecting' | 'failed'

export interface AgentTool {
  id: string
  name: string
  status: ToolConnectionStatus
}

export interface TeamAgent {
  id: string
  name: string
  role: string
  model: ModelType
  tools: AgentTool[]
  task: string
  icon: string
}

export interface SavedTeam {
  id: string
  name: string
  description: string
  icon: string
  agents: TeamAgent[]
  lastUsed: Date
  executionHistory: {
    id: string
    date: Date
    success: boolean
    duration: number
  }[]
}

export interface RecentChat {
  id: string
  title: string
  timestamp: Date
  isActive: boolean
}

export interface KnowledgeDoc {
  id: string
  name: string
  type: 'folder' | 'file'
  count?: number
}
