"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ToolCall } from "@/lib/types"
import { ChevronDown, Copy, Check, Loader2, CheckCircle2, XCircle, Circle } from "lucide-react"

interface ToolCallCardProps {
  tool: ToolCall
  onToggle: () => void
}

export function ToolCallCard({ tool, onToggle }: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState<"input" | "result" | null>(null)

  const handleCopy = async (data: unknown, type: "input" | "result") => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const statusConfig = {
    pending: {
      icon: Circle,
      className: "text-muted-foreground",
      bgClassName: "bg-muted/50",
      borderClassName: "border-border",
    },
    running: {
      icon: Loader2,
      className: "text-primary animate-spin",
      bgClassName: "bg-primary/5",
      borderClassName: "border-primary/30",
    },
    success: {
      icon: CheckCircle2,
      className: "text-primary",
      bgClassName: "bg-primary/5",
      borderClassName: "border-primary/30",
    },
    error: {
      icon: XCircle,
      className: "text-destructive",
      bgClassName: "bg-destructive/5",
      borderClassName: "border-destructive/30",
    },
  }

  const config = statusConfig[tool.status]
  const StatusIcon = config.icon

  return (
    <div
      className={cn(
        "border rounded-lg transition-all duration-200",
        config.borderClassName,
        config.bgClassName,
        expanded && "shadow-sm"
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-left hover:bg-muted/30 transition-colors"
      >
        {/* Tool icon */}
        <div className="w-8 h-8 flex items-center justify-center border border-border rounded-md bg-background font-mono text-[10px]">
          {tool.icon}
        </div>

        {/* Tool info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{tool.displayName}</div>
          <div className="text-xs text-muted-foreground">
            {tool.status === "running" && "Executing..."}
            {tool.status === "success" && `Completed in ${tool.duration?.toFixed(1)}s`}
            {tool.status === "error" && "Failed"}
            {tool.status === "pending" && "Queued"}
          </div>
        </div>

        {/* Status icon */}
        <StatusIcon className={cn("w-4 h-4", config.className)} />

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
        <div className="border-t border-border p-2 sm:p-3 space-y-2 sm:space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Input
              </span>
              <button
                type="button"
                onClick={() => handleCopy(tool.input, "input")}
                className="p-1 hover:bg-muted transition-colors"
              >
                {copied === "input" ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
            </div>
            <pre className="text-xs p-2 bg-muted/50 border border-border rounded-md overflow-x-auto font-mono">
              {JSON.stringify(tool.input, null, 2)}
            </pre>
          </div>

          {/* Result */}
          {tool.result && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Result
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(tool.result, "result")}
                  className="p-1 hover:bg-muted transition-colors"
                >
                  {copied === "result" ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  )}
                </button>
              </div>
              <pre className="text-xs p-2 bg-muted/50 border border-border rounded-md overflow-x-auto font-mono">
                {JSON.stringify(tool.result, null, 2)}
              </pre>
            </div>
          )}

          {/* Error */}
          {tool.error && (
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-destructive uppercase tracking-wider">
                Error
              </span>
              <pre className="text-xs p-2 bg-destructive/10 border border-destructive/30 rounded-md text-destructive overflow-x-auto font-mono">
                {tool.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
