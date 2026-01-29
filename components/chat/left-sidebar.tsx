"use client"

import { cn } from "@/lib/utils"
import type { RecentChat, KnowledgeDoc } from "@/lib/types"
import {
  MessageSquare,
  Plus,
  FileText,
  Folder,
  Upload,
  Clock,
} from "lucide-react"

interface LeftSidebarProps {
  recentChats: RecentChat[]
  knowledgeDocs: KnowledgeDoc[]
  activeChat?: string
  onChatSelect: (id: string) => void
  onNewChat: () => void
  onUpload: () => void
}

export function LeftSidebar({
  recentChats,
  knowledgeDocs,
  activeChat,
  onChatSelect,
  onNewChat,
  onUpload,
}: LeftSidebarProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return "Yesterday"
    return `${diffDays} days ago`
  }

  return (
    <div className="h-full flex flex-col border-r border-border bg-background">
      {/* Recent Chats Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 py-2 border-b border-border">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Recent Chats
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {recentChats.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">No chats yet</p>
            </div>
          ) : (
            <div className="py-1">
              {recentChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => onChatSelect(chat.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors border-l-2 border-transparent",
                    activeChat === chat.id && "bg-muted/50 border-l-primary"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                      chat.isActive ? "bg-[var(--status-connected)]" : "bg-muted-foreground/30"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {chat.title}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTimestamp(chat.timestamp)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* New Chat Button */}
        <div className="p-2 border-t border-border">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs border border-dashed border-border rounded-md hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-3 h-3" />
            New Chat
          </button>
        </div>
      </div>

      {/* Knowledge Base Section */}
      <div className="border-t border-border">
        <div className="px-3 py-2 border-b border-border">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Knowledge Base
          </span>
        </div>

        <div className="p-2 space-y-0.5 max-h-40 overflow-y-auto">
          {knowledgeDocs.length === 0 ? (
            <div className="px-2 py-4 text-center">
              <p className="text-[10px] text-muted-foreground">No documents</p>
            </div>
          ) : (
            knowledgeDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {doc.type === "folder" ? (
                  <Folder className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="flex-1 truncate">{doc.name}</span>
                {doc.count && (
                  <span className="text-[10px] text-muted-foreground">
                    ({doc.count})
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Upload Button */}
        <div className="p-2 border-t border-border">
          <button
            type="button"
            onClick={onUpload}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs border border-dashed border-border rounded-md hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Upload className="w-3 h-3" />
            Upload Documents
          </button>
        </div>
      </div>
    </div>
  )
}
