"use client"

import { useCallback, useRef, useEffect, useState } from "react"
import { useAcquisitionSimulation } from "@/hooks/use-acquisition-simulation"
import { MessageBubble } from "@/components/chat/message-bubble"
import { ChatInput } from "@/components/chat/chat-input"
import { LeftSidebar } from "@/components/chat/left-sidebar"
import { RightSidebar } from "@/components/chat/right-sidebar"
import { TeamConstructionCard } from "@/components/chat/team-construction-card"
import { SaveTeamPrompt } from "@/components/chat/save-team-prompt"
import type { RecentChat, KnowledgeDoc, SavedTeam, TeamAgent } from "@/lib/types"
import { Play, RotateCcw, Sparkles, Bot, Zap, GitBranch, Rocket, BarChart3, FileText, Search } from "lucide-react"

// Mock data for sidebars
const mockRecentChats: RecentChat[] = [
  { id: "1", title: "HVAC targets in Atlanta", timestamp: new Date(Date.now() - 12 * 60000), isActive: true },
  { id: "2", title: "Plumbing acquisition search", timestamp: new Date(Date.now() - 2 * 3600000), isActive: false },
  { id: "3", title: "Deal memo - Metro HVAC", timestamp: new Date(Date.now() - 86400000), isActive: false },
]

const mockKnowledgeDocs: KnowledgeDoc[] = [
  { id: "1", name: "Investment Thesis", type: "folder", count: 3 },
  { id: "2", name: "SBA Guidelines.pdf", type: "file" },
  { id: "3", name: "Industry Comps.xlsx", type: "file" },
]

const mockSavedTeams: SavedTeam[] = [
  {
    id: "1",
    name: "M&A Sourcing Team",
    description: "Full acquisition sourcing pipeline with discovery, enrichment, financial analysis, and document generation",
    icon: "search",
    agents: [
      { id: "a1", name: "Discovery", role: "discovery", model: "sonnet", tools: [], task: "Search listings", icon: "search" },
      { id: "a2", name: "Enrichment", role: "enrichment", model: "haiku", tools: [], task: "Company data", icon: "database" },
      { id: "a3", name: "Financial", role: "financial", model: "sonnet", tools: [], task: "Valuation", icon: "chart" },
      { id: "a4", name: "AI Analyst", role: "ai", model: "sonnet", tools: [], task: "AI opportunities", icon: "sparkles" },
      { id: "a5", name: "Documents", role: "documents", model: "sonnet", tools: [], task: "Deal packages", icon: "file" },
    ],
    lastUsed: new Date(Date.now() - 2 * 60000),
    executionHistory: [
      { id: "e1", date: new Date(Date.now() - 2 * 60000), success: true, duration: 49 },
    ],
  },
  {
    id: "2",
    name: "Financial Audit Team",
    description: "Deep financial analysis and due diligence for acquisition targets",
    icon: "chart",
    agents: [
      { id: "b1", name: "Analyst", role: "analyst", model: "opus", tools: [], task: "Financial review", icon: "chart" },
      { id: "b2", name: "Auditor", role: "auditor", model: "sonnet", tools: [], task: "Due diligence", icon: "search" },
    ],
    lastUsed: new Date(Date.now() - 86400000),
    executionHistory: [],
  },
]

// M&A Acquisition Team Agents
const acquisitionTeamAgents: TeamAgent[] = [
  {
    id: "t1",
    name: "Discovery Coordinator",
    role: "discovery",
    model: "sonnet",
    tools: [
      { id: "websearch", name: "WebSearch", status: "connected" },
      { id: "webfetch", name: "WebFetch", status: "connected" },
      { id: "bash", name: "Bash", status: "connected" },
    ],
    task: "Search listing sites for acquisition targets matching investment thesis",
    icon: "search",
  },
  {
    id: "t2",
    name: "Enrichment Specialist",
    role: "enrichment",
    model: "haiku",
    tools: [
      { id: "websearch2", name: "WebSearch", status: "connected" },
      { id: "webfetch2", name: "WebFetch", status: "connected" },
      { id: "builtwith", name: "BuiltWith API", status: "connected" },
    ],
    task: "Enrich listings with company data, reviews, tech stack, owner research",
    icon: "database",
  },
  {
    id: "t3",
    name: "Financial Analyst",
    role: "financial",
    model: "sonnet",
    tools: [
      { id: "docparser", name: "DocumentParser", status: "connected" },
      { id: "calculator", name: "Calculator", status: "connected" },
      { id: "industrycomps", name: "IndustryComps", status: "connected" },
    ],
    task: "Analyze financials, calculate SDE, assess valuations",
    icon: "chart",
  },
  {
    id: "t4",
    name: "AI Opportunity Analyst",
    role: "ai",
    model: "sonnet",
    tools: [
      { id: "taxonomy", name: "TaxonomyMatcher", status: "connected" },
      { id: "roicalc", name: "ROICalculator", status: "connected" },
      { id: "write", name: "Write", status: "connected" },
    ],
    task: "Identify AI automation opportunities and model ROI",
    icon: "sparkles",
  },
  {
    id: "t5",
    name: "Document Generator",
    role: "documents",
    model: "sonnet",
    tools: [
      { id: "docx", name: "python-docx", status: "connected" },
      { id: "pptx", name: "python-pptx", status: "connected" },
      { id: "weasyprint", name: "weasyprint", status: "connected" },
    ],
    task: "Generate investment memos, executive summaries, outreach emails",
    icon: "file",
  },
]

export default function SwarmChat() {
  const simulation = useAcquisitionSimulation()
  
  const [showTeamConstruction, setShowTeamConstruction] = useState(false)
  const [showSavePrompt, setShowSavePrompt] = useState(false)
  const [savedTeams, setSavedTeams] = useState(mockSavedTeams)
  const [activeChat, setActiveChat] = useState("1")

  const { messages, files, isPlaying, currentStep, totalSteps } = simulation

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Show save prompt when demo completes
  useEffect(() => {
    if (!isPlaying && messages.length > 0 && currentStep === totalSteps) {
      const timer = setTimeout(() => {
        setShowSavePrompt(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, messages.length, currentStep, totalSteps])

  const handleRunDemo = useCallback(() => {
    setShowSavePrompt(false)
    setShowTeamConstruction(true)
  }, [])

  const handleApproveTeam = useCallback(() => {
    setShowTeamConstruction(false)
    simulation.runAcquisitionScenario()
  }, [simulation])

  const handleReset = useCallback(() => {
    setShowTeamConstruction(false)
    setShowSavePrompt(false)
    simulation.reset()
  }, [simulation])

  const handleSaveTeam = useCallback((name: string, description: string) => {
    const newTeam: SavedTeam = {
      id: `team-${Date.now()}`,
      name,
      description,
      icon: "search",
      agents: acquisitionTeamAgents,
      lastUsed: new Date(),
      executionHistory: [
        { id: `exec-${Date.now()}`, date: new Date(), success: true, duration: 49 },
      ],
    }
    setSavedTeams((prev) => [newTeam, ...prev])
    setShowSavePrompt(false)
  }, [])

  const handleToggleTool = useCallback(() => {
    // Tool toggle handler
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 border border-primary bg-primary/10 rounded-md">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">
              <span className="text-foreground">ACQUI</span>
              <span className="text-primary">PORTAL</span>
            </h1>
            <p className="text-xs text-muted-foreground">M&A Intelligence Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status indicators */}
          <div className="hidden lg:flex items-center gap-4 mr-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>Claude Agent SDK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Streaming</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Multi-Agent</span>
            </div>
          </div>

          {/* Controls */}
          <button
            type="button"
            onClick={handleReset}
            disabled={isPlaying}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleRunDemo}
            disabled={isPlaying || showTeamConstruction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3 h-3" />
            Run Demo
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Recent Chats + Knowledge Base */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <LeftSidebar
            recentChats={mockRecentChats}
            knowledgeDocs={mockKnowledgeDocs}
            activeChat={activeChat}
            onChatSelect={setActiveChat}
            onNewChat={() => {}}
            onUpload={() => {}}
          />
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {messages.length === 0 && !showTeamConstruction ? (
                <div className="max-w-3xl mx-auto">
                  <EmptyState onStart={handleRunDemo} />
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onToggleTool={handleToggleTool}
                    />
                  ))}
                  
                  {/* Team Construction Card - shown before execution */}
                  {showTeamConstruction && messages.length <= 1 && (
                    <div className="flex justify-start pl-0">
                      <div className="max-w-[90%]">
                        <TeamConstructionCard
                          agents={acquisitionTeamAgents}
                          onApprove={handleApproveTeam}
                          onCustomize={() => {}}
                          allToolsReady={true}
                          onToolAuth={() => {}}
                        />
                      </div>
                    </div>
                  )}

                  {/* Save Team Prompt - shown after completion */}
                  {showSavePrompt && !isPlaying && (
                    <div className="flex justify-start pl-0">
                      <div className="max-w-[85%] ml-11">
                        <SaveTeamPrompt
                          suggestedName="M&A Sourcing Team"
                          suggestedDescription="Full acquisition sourcing pipeline with discovery, enrichment, financial analysis, AI opportunity assessment, and document generation"
                          onSave={handleSaveTeam}
                          onDismiss={() => setShowSavePrompt(false)}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                onSend={() => handleRunDemo()}
                disabled={isPlaying}
              />
            </div>
          </div>
        </main>

        {/* Right sidebar - Saved Teams + Files + Agent Activity */}
        <aside className="hidden md:block w-72 flex-shrink-0">
          <RightSidebar
            savedTeams={savedTeams}
            files={files}
            messages={messages}
            isPlaying={isPlaying}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onTeamClick={() => {}}
            onCreateTeam={() => {}}
            onBrowseTeams={() => {}}
            onFileClick={() => {}}
            onDownloadAll={() => {}}
          />
        </aside>
      </div>
    </div>
  )
}

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 flex items-center justify-center border border-primary bg-primary/10 rounded-lg mb-6">
        <Zap className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-lg font-semibold mb-2">
        <span className="text-foreground">ACQUI</span>
        <span className="text-primary">PORTAL</span>
      </h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-md text-balance">
        The most advanced M&A intelligence platform. Automate sourcing, auditing, and deal-memo generation with AI agents.
      </p>

      {/* Suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-lg">
        <button
          type="button"
          onClick={onStart}
          className="flex items-center gap-2 px-3 py-2 text-xs border border-primary bg-primary/10 text-primary rounded-md transition-colors hover:bg-primary/15"
        >
          <Search className="w-3.5 h-3.5" />
          Source acquisition targets
        </button>
        <button
          type="button"
          onClick={onStart}
          className="flex items-center gap-2 px-3 py-2 text-xs border border-border rounded-md hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          Generate deal memo
        </button>
        <button
          type="button"
          onClick={onStart}
          className="flex items-center gap-2 px-3 py-2 text-xs border border-border rounded-md hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Run financial audit
        </button>
        <button
          type="button"
          onClick={onStart}
          className="flex items-center gap-2 px-3 py-2 text-xs border border-border rounded-md hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Rocket className="w-3.5 h-3.5" />
          Research competitors
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs">
        <div className="p-3 border border-border rounded-lg bg-card">
          <Bot className="w-4 h-4 mx-auto mb-2 text-primary" />
          <div className="font-medium">5 Agents</div>
          <div className="text-muted-foreground">Specialized team</div>
        </div>
        <div className="p-3 border border-border rounded-lg bg-card">
          <Zap className="w-4 h-4 mx-auto mb-2 text-primary" />
          <div className="font-medium">8 Tools</div>
          <div className="text-muted-foreground">Parallel execution</div>
        </div>
        <div className="p-3 border border-border rounded-lg bg-card">
          <GitBranch className="w-4 h-4 mx-auto mb-2 text-primary" />
          <div className="font-medium">18 Files</div>
          <div className="text-muted-foreground">Deal analysis</div>
        </div>
      </div>
    </div>
  )
}
