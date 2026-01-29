"use client"

import { useState } from "react"
import { Save, X } from "lucide-react"

interface SaveTeamPromptProps {
  suggestedName: string
  suggestedDescription: string
  onSave: (name: string, description: string) => void
  onDismiss: () => void
}

export function SaveTeamPrompt({
  suggestedName,
  suggestedDescription,
  onSave,
  onDismiss,
}: SaveTeamPromptProps) {
  const [name, setName] = useState(suggestedName)
  const [description, setDescription] = useState(suggestedDescription)

  return (
    <div className="border border-border rounded-lg bg-card p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-3">
        <Save className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium">Save this team?</span>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="team-name" className="block text-[10px] text-muted-foreground mb-1">
            Name
          </label>
          <input
            id="team-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md focus:border-primary focus:outline-none transition-colors"
            placeholder="Team name..."
          />
        </div>
        <div>
          <label htmlFor="team-description" className="block text-[10px] text-muted-foreground mb-1">
            Description
          </label>
          <input
            id="team-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md focus:border-primary focus:outline-none transition-colors"
            placeholder="What does this team do..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          type="button"
          onClick={() => onSave(name, description)}
          disabled={!name.trim()}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-3.5 h-3.5" />
          Save Team
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Not Now
        </button>
      </div>
    </div>
  )
}
