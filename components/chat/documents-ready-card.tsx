"use client"

import { FileText, Download, ExternalLink, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FileItem } from "@/lib/types"

interface DocumentsReadyCardProps {
  files: FileItem[]
  onDismiss?: () => void
}

const getFileIcon = (name: string) => {
  if (name.endsWith('.pdf')) return '📄'
  if (name.endsWith('.docx')) return '📝'
  if (name.endsWith('.pptx')) return '📊'
  if (name.endsWith('.txt')) return '📋'
  if (name.endsWith('.json')) return '🔧'
  return '📄'
}

const getFileLabel = (name: string) => {
  if (name.includes('Executive_Summary')) return 'Executive Summary'
  if (name.includes('Investment_Memo')) return 'Investment Memo'
  if (name.includes('AI_Opportunity')) return 'AI Opportunity Report'
  if (name.includes('Lender_Presentation')) return 'Lender Presentation'
  if (name.includes('Outreach_Email')) return 'Broker Outreach Email'
  if (name.includes('final_rankings')) return 'Final Rankings'
  return name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
}

export function DocumentsReadyCard({ files, onDismiss }: DocumentsReadyCardProps) {
  const outputFiles = files.filter(f => f.url)
  
  if (outputFiles.length === 0) return null

  return (
    <div className="flex justify-start pl-0">
      <div className="max-w-[85%] ml-2 sm:ml-11">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 sm:p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-emerald-900 dark:text-emerald-100">
                Your Documents Are Ready
              </h3>
              <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
                {outputFiles.length} deal package files generated
              </p>
            </div>
            <Sparkles className="size-5 text-amber-500 ml-auto animate-pulse" />
          </div>

          {/* File Grid */}
          <div className="grid gap-2 sm:gap-3">
            {outputFiles.map((file) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl",
                  "bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700",
                  "hover:border-emerald-400 hover:shadow-md transition-all group cursor-pointer"
                )}
              >
                <span className="text-xl sm:text-2xl">{getFileIcon(file.name)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">
                    {getFileLabel(file.name)}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 truncate">
                    {file.name}
                  </div>
                </div>
                <ExternalLink className="size-4 text-slate-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Click any file to view or download
            </p>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
