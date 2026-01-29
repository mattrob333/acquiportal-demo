"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { TeamAgent, ToolConnectionStatus } from "@/lib/types"
import {
  Check,
  AlertCircle,
  Loader2,
  X,
  Code,
  Server,
  Database,
  Rocket,
  Search,
  Pencil,
  Palette,
  FileText,
  Mail,
  Share2,
  BarChart3,
  Sparkles,
  TrendingUp,
  Layers,
} from "lucide-react"

interface TeamConstructionCardProps {
  agents: TeamAgent[]
  onApprove: () => void
  onCustomize: () => void
  allToolsReady: boolean
  onToolAuth: (agentId: string, toolId: string) => void
}

const roleIcons: Record<string, React.ReactNode> = {
  // Original roles
  frontend: <Code className="w-5 h-5" />,
  backend: <Server className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  devops: <Rocket className="w-5 h-5" />,
  research: <Search className="w-5 h-5" />,
  copywriter: <FileText className="w-5 h-5" />,
  designer: <Palette className="w-5 h-5" />,
  analytics: <BarChart3 className="w-5 h-5" />,
  social: <Share2 className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
  // M&A roles
  discovery: <Search className="w-5 h-5" />,
  enrichment: <Layers className="w-5 h-5" />,
  financial: <TrendingUp className="w-5 h-5" />,
  ai: <Sparkles className="w-5 h-5" />,
  documents: <FileText className="w-5 h-5" />,
  default: <Code className="w-5 h-5" />,
}

const modelColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
  opus: { 
    bg: "bg-[var(--model-opus)]/10", 
    text: "text-[var(--model-opus)]", 
    border: "border-[var(--model-opus)]/30",
    label: "Opus 4.5" 
  },
  sonnet: { 
    bg: "bg-[var(--model-sonnet)]/10", 
    text: "text-[var(--model-sonnet)]", 
    border: "border-[var(--model-sonnet)]/30",
    label: "Sonnet 4.5" 
  },
  haiku: { 
    bg: "bg-[var(--model-haiku)]/10", 
    text: "text-[var(--model-haiku)]", 
    border: "border-[var(--model-haiku)]/30",
    label: "Haiku 4.5" 
  },
}

const statusIcons: Record<ToolConnectionStatus, React.ReactNode> = {
  connected: <Check className="w-3 h-3 text-[var(--status-connected)]" />,
  "needs-auth": <AlertCircle className="w-3 h-3 text-[var(--status-needs-auth)]" />,
  connecting: <Loader2 className="w-3 h-3 text-[var(--status-connecting)] animate-spin" />,
  failed: <X className="w-3 h-3 text-[var(--status-failed)]" />,
}

function HorizontalAgentCard({
  agent,
  index,
  onToolAuth,
}: {
  agent: TeamAgent
  index: number
  onToolAuth: (toolId: string) => void
}) {
  const [visible, setVisible] = useState(false)
  const [toolsVisible, setToolsVisible] = useState(false)
  const icon = roleIcons[agent.role] || roleIcons.default
  const modelConfig = modelColors[agent.model]

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), index * 150)
    const toolsTimer = setTimeout(() => setToolsVisible(true), index * 150 + 200)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(toolsTimer)
    }
  }, [index])

  return (
    <div
      className={cn(
        "min-w-[200px] max-w-[200px] flex flex-col border border-border rounded-lg bg-card transition-all duration-300",
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
      )}
    >
      {/* Header with icon and name */}
      <div className="p-4 pb-3 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-md">
            {icon}
          </div>
        </div>
        <div className="text-sm font-medium leading-tight">{agent.name}</div>
      </div>

      {/* Model badge */}
      <div className="px-4 py-2 border-b border-border">
        <span className={cn(
          "inline-flex items-center px-2 py-1 text-[10px] font-medium border rounded-md",
          modelConfig.bg,
          modelConfig.text,
          modelConfig.border
        )}>
          {modelConfig.label}
        </span>
      </div>

      {/* Tools */}
      <div className="px-4 py-3 border-b border-border flex-1">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Tools</div>
        <div className={cn(
          "space-y-1.5 transition-all duration-200",
          toolsVisible ? "opacity-100" : "opacity-0"
        )}>
          {agent.tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => tool.status !== "connected" && onToolAuth(tool.id)}
              disabled={tool.status === "connected" || tool.status === "connecting"}
              className={cn(
                "flex items-center gap-1.5 text-[11px] w-full",
                tool.status === "connected" && "text-[var(--status-connected)]",
                tool.status === "needs-auth" && "text-[var(--status-needs-auth)] hover:underline cursor-pointer",
                tool.status === "connecting" && "text-[var(--status-connecting)]",
                tool.status === "failed" && "text-[var(--status-failed)] hover:underline cursor-pointer"
              )}
            >
              {statusIcons[tool.status]}
              <span>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task */}
      <div className="px-4 py-3">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Task</div>
        <div className="text-xs text-foreground/80 line-clamp-2">{agent.task}</div>
      </div>
    </div>
  )
}

export function TeamConstructionCard({
  agents,
  onApprove,
  onCustomize,
  allToolsReady,
  onToolAuth,
}: TeamConstructionCardProps) {
  const [headerVisible, setHeaderVisible] = useState(false)
  const [actionsVisible, setActionsVisible] = useState(false)
  
  const needsAuthTools = agents.flatMap((a) =>
    a.tools.filter((t) => t.status === "needs-auth")
  )

  useEffect(() => {
    const headerTimer = setTimeout(() => setHeaderVisible(true), 100)
    const actionsTimer = setTimeout(() => setActionsVisible(true), agents.length * 150 + 300)
    return () => {
      clearTimeout(headerTimer)
      clearTimeout(actionsTimer)
    }
  }, [agents.length])

  return (
    <div className={cn(
      "border border-border rounded-lg bg-card/50 transition-all duration-300",
      headerVisible ? "opacity-100" : "opacity-0"
    )}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-md">
            <Code className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider">Team Construction</span>
          <span className="text-xs text-muted-foreground ml-auto">{agents.length} agents</span>
        </div>
      </div>

      {/* Horizontal scrolling agents */}
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-3">
          {agents.map((agent, i) => (
            <HorizontalAgentCard
              key={agent.id}
              agent={agent}
              index={i}
              onToolAuth={(toolId) => onToolAuth(agent.id, toolId)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={cn(
        "px-4 py-3 border-t border-border flex items-center gap-2 transition-all duration-300",
        actionsVisible ? "opacity-100" : "opacity-0"
      )}>
        <button
          type="button"
          onClick={onApprove}
          disabled={!allToolsReady}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all",
            allToolsReady
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <Check className="w-3.5 h-3.5" />
          {allToolsReady ? "Approve Team" : `Connect ${needsAuthTools.length} Tool${needsAuthTools.length > 1 ? "s" : ""}`}
        </button>
        <button
          type="button"
          onClick={onCustomize}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Customize
        </button>
      </div>
    </div>
  )
}
