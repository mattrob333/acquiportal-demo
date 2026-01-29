"use client"

import { cn } from "@/lib/utils"
import { Brain } from "lucide-react"

interface ThinkingIndicatorProps {
  reasons?: string[]
}

export function ThinkingIndicator({ reasons }: ThinkingIndicatorProps) {
  return (
    <div className="space-y-2 animate-in fade-in duration-300">
      {/* Inline thinking pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/30 rounded-full bg-primary/5">
        <Brain className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs text-primary">Thinking</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "200ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "400ms" }} />
        </div>
      </div>

      {/* Reasoning steps */}
      {reasons && reasons.length > 0 && (
        <div className="border-l-2 border-primary/30 pl-3 space-y-1">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={cn(
                "text-xs text-muted-foreground animate-in fade-in slide-in-from-left-2",
                "flex items-center gap-2"
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <span className="text-muted-foreground/50">→</span>
              {reason}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
