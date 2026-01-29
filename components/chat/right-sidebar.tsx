"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import type { Message, SavedTeam, FileItem } from "@/lib/types"
import {
  Bot,
  CheckCircle2,
  Loader2,
  Zap,
  Clock,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Rocket,
  BarChart3,
  Database,
  Settings,
  Package,
  Folder,
  FileCode,
  FileJson,
  FileText,
  Download,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react"

interface RightSidebarProps {
  savedTeams: SavedTeam[]
  files: FileItem[]
  messages: Message[]
  isPlaying: boolean
  currentStep: number
  totalSteps: number
  onTeamClick: (id: string) => void
  onCreateTeam: () => void
  onBrowseTeams: () => void
  onFileClick?: (file: FileItem) => void
  onDownloadAll?: () => void
}

const teamIcons: Record<string, React.ReactNode> = {
  rocket: <Rocket className="w-4 h-4" />,
  chart: <BarChart3 className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
  default: <Package className="w-4 h-4" />,
}

const fileIcons: Record<string, React.ReactNode> = {
  tsx: <FileCode className="w-3.5 h-3.5 text-[var(--model-sonnet)]" />,
  ts: <FileCode className="w-3.5 h-3.5 text-[var(--model-sonnet)]" />,
  jsx: <FileCode className="w-3.5 h-3.5 text-[var(--model-sonnet)]" />,
  js: <FileCode className="w-3.5 h-3.5 text-yellow-500" />,
  json: <FileJson className="w-3.5 h-3.5 text-yellow-500" />,
  sql: <Database className="w-3.5 h-3.5 text-[var(--model-haiku)]" />,
  css: <FileText className="w-3.5 h-3.5 text-[var(--model-opus)]" />,
  md: <FileText className="w-3.5 h-3.5 text-muted-foreground" />,
  folder: <Folder className="w-3.5 h-3.5 text-muted-foreground" />,
  default: <FileText className="w-3.5 h-3.5 text-muted-foreground" />,
}

function getFileIcon(file: FileItem) {
  if (file.type === "folder") return fileIcons.folder
  const ext = file.name.split(".").pop()?.toLowerCase()
  return fileIcons[ext || ""] || fileIcons.default
}

export function RightSidebar({
  savedTeams,
  files,
  messages,
  isPlaying,
  currentStep,
  totalSteps,
  onTeamClick,
  onCreateTeam,
  onBrowseTeams,
  onFileClick,
  onDownloadAll,
}: RightSidebarProps) {
  const [teamsExpanded, setTeamsExpanded] = useState(false)

  // Extract all agents from messages
  const allAgents = messages.flatMap((msg) => msg.spawnedAgents)

  // Count tool calls
  const allToolCalls = messages.flatMap((msg) => [
    ...msg.toolCalls,
    ...msg.spawnedAgents.flatMap((a) => a.toolCalls),
  ])

  const completedAgents = allAgents.filter((a) => a.status === "complete").length
  const completedTools = allToolCalls.filter((t) => t.status === "success").length

  // Get recently created files (last 10 seconds simulated)
  const recentFiles = files.filter((f) => f.status === "created").slice(-3)

  const formatLastUsed = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  return (
    <div className="h-full flex flex-col border-l border-border bg-background">
      {/* Saved Teams Section - Collapsible */}
      <div className="flex-shrink-0 border-b border-border">
        <button
          type="button"
          onClick={() => setTeamsExpanded(!teamsExpanded)}
          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/30 transition-colors"
        >
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Saved Teams
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">{savedTeams.length}</span>
            {teamsExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Collapsible content */}
        <div className={cn(
          "overflow-hidden transition-all duration-200 ease-out",
          teamsExpanded ? "max-h-64" : "max-h-0"
        )}>
          <div className="p-2 space-y-2 max-h-56 overflow-y-auto">
            {savedTeams.length === 0 ? (
              <div className="py-4 text-center">
                <Package className="w-6 h-6 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-[10px] text-muted-foreground">No saved teams yet</p>
              </div>
            ) : (
              savedTeams.slice(0, 3).map((team) => (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => onTeamClick(team.id)}
                  className="w-full p-2.5 text-left border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-muted text-muted-foreground">
                      {teamIcons[team.icon] || teamIcons.default}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                        {team.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {team.agents.length} agents
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {formatLastUsed(team.lastUsed)}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {savedTeams.length > 0 && (
            <div className="px-2 pb-2">
              <button
                type="button"
                onClick={onBrowseTeams}
                className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse All Teams
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Files Section - Always Visible */}
      <div className="flex-1 flex flex-col border-b border-border overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Files
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">({files.length})</span>
            {files.length > 0 && (
              <button
                type="button"
                onClick={onDownloadAll}
                className="p-1 hover:bg-muted transition-colors"
                title="Download all files"
              >
                <Download className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {files.length === 0 ? (
            <div className="py-8 text-center">
              <Folder className="w-6 h-6 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-[10px] text-muted-foreground">No files generated yet</p>
            </div>
          ) : (
            <div className="p-2">
              {/* File tree */}
              <div className="space-y-0.5">
                {files.map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => onFileClick?.(file)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-muted/50 transition-colors group",
                      file.type === "folder" ? "pl-2" : "pl-5",
                      file.status === "pending" && "opacity-50"
                    )}
                  >
                    {getFileIcon(file)}
                    <span className="text-[11px] truncate flex-1">{file.name}</span>
                    {file.status === "created" && recentFiles.includes(file) && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-[var(--status-connected)]/10 text-[var(--status-connected)] animate-pulse">
                        NEW
                      </span>
                    )}
                    {file.status === "created" && !recentFiles.includes(file) && (
                      <CheckCircle2 className="w-3 h-3 text-[var(--status-connected)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    {file.status === "pending" && (
                      <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
                    )}
                  </button>
                ))}
              </div>

              {/* Recently created */}
              {recentFiles.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-[10px] text-muted-foreground mb-2">Recently Created</div>
                  <div className="space-y-1">
                    {recentFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 text-[10px]">
                        <span className="w-1 h-1 rounded-full bg-[var(--status-connected)]" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-muted-foreground">(just now)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="p-2 border-t border-border">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] border border-border hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View in IDE
            </button>
          </div>
        )}
      </div>

      {/* Agent Activity Section - Compact, Bottom */}
      <div className="flex-shrink-0 max-h-[30%]">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Agent Activity
          </span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs font-mono",
              isPlaying ? "text-primary" : "text-muted-foreground"
            )}>
              {currentStep}/{totalSteps}
            </span>
            {isPlaying && (
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
            <button type="button" className="p-1 hover:bg-muted transition-colors">
              <MoreHorizontal className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-3 py-2 border-b border-border">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 ease-out rounded-full",
                isPlaying ? "bg-primary" : "bg-primary"
              )}
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Compact agent list */}
        <div className="overflow-y-auto max-h-40">
          {allAgents.length === 0 ? (
            <div className="text-[10px] text-muted-foreground text-center py-4">
              No agents active
            </div>
          ) : (
            <div className="divide-y divide-border">
              {allAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    "px-3 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200",
                    agent.status === "working" && "bg-primary/5"
                  )}
                >
                  {/* Status icon */}
                  {agent.status === "complete" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  ) : agent.status === "working" || agent.status === "initializing" ? (
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30 flex-shrink-0" />
                  )}

                  {/* Agent name */}
                  <span className="text-[11px] truncate flex-1">{agent.name}</span>

                  {/* Duration */}
                  {agent.duration ? (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {agent.duration.toFixed(1)}s
                    </span>
                  ) : agent.status === "working" ? (
                    <span className="text-[10px] text-primary font-mono">
                      {((currentStep % 10) * 0.8).toFixed(1)}s
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
