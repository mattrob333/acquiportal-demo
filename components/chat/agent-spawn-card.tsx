"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { AgentSpawn } from "@/lib/types"
import { ToolCallCard } from "./tool-call-card"
import { ChevronDown, Loader2, CheckCircle2, XCircle, Bot } from "lucide-react"

interface AgentSpawnCardProps {
  agent: AgentSpawn
  onToggleTool: (toolId: string) => void
}

export function AgentSpawnCard({ agent, onToggleTool }: AgentSpawnCardProps) {
  const [expanded, setExpanded] = useState(true)

  const statusConfig = {
    initializing: {
      color: "text-primary",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/30",
      label: "Initializing...",
    },
    working: {
      color: "text-primary",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/30",
      label: "Working...",
    },
    complete: {
      color: "text-primary",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/30",
      label: "Complete",
    },
    error: {
      color: "text-destructive",
      bgColor: "bg-destructive/5",
      borderColor: "border-destructive/30",
      label: "Error",
    },
  }

  const config = statusConfig[agent.status]
  const progressPercent = (agent.progress.current / agent.progress.total) * 100

  return (
    <div
      className={cn(
        "border-l-2 pl-2 sm:pl-4 ml-4 sm:ml-10 animate-in fade-in slide-in-from-left-4 duration-300",
        config.borderColor
      )}
    >
      <div className={cn("border rounded-lg", config.borderColor, config.bgColor)}>
        {/* Header */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-left hover:bg-muted/30 transition-colors"
        >
          {/* Agent icon */}
          <div
            className={cn(
              "w-8 h-8 flex items-center justify-center border rounded-md",
              config.borderColor,
              "bg-background"
            )}
          >
            <Bot className={cn("w-4 h-4", config.color)} />
          </div>

          {/* Agent info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{agent.name}</div>
            <div className="text-xs text-muted-foreground truncate">{agent.task}</div>
          </div>

          {/* Status */}
          <div className={cn("flex items-center gap-1.5 text-xs font-medium", config.color)}>
            {agent.status === "working" || agent.status === "initializing" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : agent.status === "complete" ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            <span>
              {agent.progress.current}/{agent.progress.total}
            </span>
          </div>

          {/* Expand icon */}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="border-t border-border p-2 sm:p-3 space-y-2 sm:space-y-3 animate-in fade-in duration-200">
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className={config.color}>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500 ease-out rounded-full bg-primary"
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Subtasks */}
            {agent.subtasks.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Subtasks
                </span>
                <div className="border border-border rounded-md bg-background divide-y divide-border">
                  {agent.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-2 px-2 py-1.5 text-xs"
                    >
                      {subtask.status === "complete" && (
                        <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                      )}
                      {subtask.status === "running" && (
                        <Loader2 className="w-3 h-3 text-primary animate-spin flex-shrink-0" />
                      )}
                      {subtask.status === "pending" && (
                        <div className="w-3 h-3 border border-border rounded-sm flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          subtask.status === "complete" && "text-muted-foreground line-through",
                          subtask.status === "running" && "text-foreground",
                          subtask.status === "pending" && "text-muted-foreground"
                        )}
                      >
                        {subtask.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tool calls */}
            {agent.toolCalls.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tool Calls
                </span>
                {agent.toolCalls.map((tool) => (
                  <ToolCallCard
                    key={tool.id}
                    tool={tool}
                    onToggle={() => onToggleTool(tool.id)}
                  />
                ))}
              </div>
            )}

            {/* Duration */}
            {agent.duration && (
              <div className="text-xs text-muted-foreground">
                Completed in {agent.duration.toFixed(1)}s
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
