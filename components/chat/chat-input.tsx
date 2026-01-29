"use client"

import React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Send, Paperclip, Mic } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border border-border rounded-lg bg-background p-3">
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <button
          type="button"
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
          disabled={disabled}
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Input */}
        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className={cn(
              "w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground",
              "min-h-[24px] max-h-[120px]",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>

        {/* Voice button */}
        <button
          type="button"
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
          disabled={disabled}
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all",
            value.trim() && !disabled
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
