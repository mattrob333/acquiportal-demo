"use client"

import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"
import { ToolCallCard } from "./tool-call-card"
import { AgentSpawnCard } from "./agent-spawn-card"
import { ThinkingIndicator } from "./thinking-indicator"

interface MessageBubbleProps {
  message: Message
  onToggleTool: (toolId: string) => void
}

export function MessageBubble({ message, onToggleTool }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4 duration-300",
        "w-full flex",
        isUser ? "justify-end pr-0" : "justify-start pl-0"
      )}
    >
      <div
        className={cn(
          "flex gap-3",
          isUser ? "flex-row-reverse max-w-[70%]" : "flex-row max-w-[85%]"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg border",
            isUser
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-primary/10 text-primary border-primary/20"
          )}
        >
          {isUser ? "U" : "AI"}
        </div>

        {/* Content */}
        <div className={cn("min-w-0 space-y-3", isUser ? "text-right" : "text-left flex-1")}>
          {/* Header */}
          <div
            className={cn(
              "flex items-center gap-2 text-xs text-muted-foreground",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            <span className="font-medium">
              {isUser ? "You" : message.agentName || "Orchestrator"}
            </span>
            <span className="opacity-50">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Thinking indicator */}
          {message.isThinking && (
            <ThinkingIndicator reasons={message.thinkingReasons} />
          )}

          {/* Message content */}
          {message.content && (
            <div
              className={cn(
                "inline-block text-left px-4 py-3 border rounded-lg",
                isUser
                  ? "bg-primary text-primary-foreground border-primary ml-auto"
                  : "bg-card text-card-foreground border-border shadow-sm",
                message.isStreaming && "animate-pulse"
              )}
            >
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.content.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-semibold mt-2 first:mt-0">{line.replace(/\*\*/g, '')}</p>
                  }
                  if (line.startsWith('- ')) {
                    return <p key={i} className="ml-2">• {line.substring(2)}</p>
                  }
                  return <p key={i} className={line === '' ? 'h-2' : ''}>{line}</p>
                })}
              </div>
            </div>
          )}

          {/* Tool calls */}
          {message.toolCalls.length > 0 && (
            <div className="space-y-2">
              {message.toolCalls.map((tool) => (
                <ToolCallCard
                  key={tool.id}
                  tool={tool}
                  onToggle={() => onToggleTool(tool.id)}
                />
              ))}
            </div>
          )}

          {/* Spawned agents */}
          {message.spawnedAgents.length > 0 && (
            <div className="space-y-3">
              {message.spawnedAgents.map((agent) => (
                <AgentSpawnCard
                  key={agent.id}
                  agent={agent}
                  onToggleTool={onToggleTool}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
