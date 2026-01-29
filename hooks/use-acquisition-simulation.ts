"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { Message, ToolCall, AgentSpawn, FileItem } from "@/lib/types"

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function useAcquisitionSimulation() {
  const [messages, setMessages] = useState<Message[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const reset = useCallback(() => {
    clearTimeouts()
    setMessages([])
    setFiles([])
    setIsPlaying(false)
    setCurrentStep(0)
  }, [clearTimeouts])

  useEffect(() => {
    return () => clearTimeouts()
  }, [clearTimeouts])

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  const updateLastMessage = useCallback((updates: Partial<Message>) => {
    setMessages((prev) => {
      const newMessages = [...prev]
      const last = newMessages[newMessages.length - 1]
      if (last) {
        newMessages[newMessages.length - 1] = { ...last, ...updates }
      }
      return newMessages
    })
  }, [])

  const addToolToAgent = useCallback((agentId: string, tool: ToolCall) => {
    setMessages((prev) => {
      return prev.map((msg) => ({
        ...msg,
        spawnedAgents: msg.spawnedAgents.map((a) =>
          a.id === agentId ? { ...a, toolCalls: [...a.toolCalls, tool] } : a
        ),
      }))
    })
  }, [])

  const updateTool = useCallback((toolId: string, updates: Partial<ToolCall>) => {
    setMessages((prev) => {
      return prev.map((msg) => ({
        ...msg,
        toolCalls: msg.toolCalls.map((t) => (t.id === toolId ? { ...t, ...updates } : t)),
        spawnedAgents: msg.spawnedAgents.map((agent) => ({
          ...agent,
          toolCalls: agent.toolCalls.map((t) => (t.id === toolId ? { ...t, ...updates } : t)),
        })),
      }))
    })
  }, [])

  const addAgentToMessage = useCallback((agent: AgentSpawn) => {
    setMessages((prev) => {
      const newMessages = [...prev]
      const last = newMessages[newMessages.length - 1]
      if (last && last.role === "assistant") {
        newMessages[newMessages.length - 1] = {
          ...last,
          spawnedAgents: [...last.spawnedAgents, agent],
        }
      }
      return newMessages
    })
  }, [])

  const updateAgent = useCallback((agentId: string, updates: Partial<AgentSpawn>) => {
    setMessages((prev) => {
      return prev.map((msg) => ({
        ...msg,
        spawnedAgents: msg.spawnedAgents.map((a) => (a.id === agentId ? { ...a, ...updates } : a)),
      }))
    })
  }, [])

  const updateAgentSubtask = useCallback(
    (agentId: string, subtaskIndex: number, updates: Partial<{ status: string }>) => {
      setMessages((prev) => {
        return prev.map((msg) => ({
          ...msg,
          spawnedAgents: msg.spawnedAgents.map((a) => {
            if (a.id === agentId) {
              const newSubtasks = [...a.subtasks]
              newSubtasks[subtaskIndex] = { ...newSubtasks[subtaskIndex], ...updates }
              return { ...a, subtasks: newSubtasks }
            }
            return a
          }),
        }))
      })
    },
    []
  )

  const addFile = useCallback((file: FileItem) => {
    setFiles((prev) => [...prev, file])
  }, [])

  const updateFile = useCallback((fileId: string, updates: Partial<FileItem>) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f)))
  }, [])

  const runAcquisitionScenario = useCallback(() => {
    reset()
    setIsPlaying(true)

    const schedule = (delay: number, fn: () => void) => {
      const timeout = setTimeout(fn, delay)
      timeoutsRef.current.push(timeout)
    }

    let step = 0
    const totalSteps = 35

    const incrementStep = () => {
      step++
      setCurrentStep(step)
    }

    // User message
    schedule(0, () => {
      incrementStep()
      addMessage({
        id: generateId(),
        role: "user",
        content: "Source acquisition targets for HVAC and plumbing companies in the Atlanta metro area, revenue between $500K-$3M, asking price under $2M",
        timestamp: new Date(),
        agentLevel: 0,
        toolCalls: [],
        spawnedAgents: [],
        isThinking: false,
        isStreaming: false,
      })
    })

    // Assistant thinking
    schedule(800, () => {
      incrementStep()
      addMessage({
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        agentName: "Orchestrator",
        agentLevel: 0,
        toolCalls: [],
        spawnedAgents: [],
        isThinking: true,
        isStreaming: false,
        thinkingReasons: [
          "Parsing investment thesis criteria...",
          "Planning M&A sourcing pipeline...",
          "Assembling specialized agent team...",
        ],
      })
    })

    // Assistant message starts
    schedule(3000, () => {
      incrementStep()
      updateLastMessage({
        isThinking: false,
        isStreaming: true,
        content: "I'll source acquisition targets matching your investment thesis with a team of 5 specialized agents. Team approved - initiating M&A pipeline...",
      })
    })

    // Add folder structure
    schedule(3200, () => {
      addFile({ id: "f1", name: "discovery", type: "folder", status: "created" })
      addFile({ id: "f2", name: "enrichment", type: "folder", status: "created" })
      addFile({ id: "f3", name: "financial", type: "folder", status: "created" })
      addFile({ id: "f4", name: "ai_opportunity", type: "folder", status: "created" })
      addFile({ id: "f5", name: "documents", type: "folder", status: "created" })
    })

    // ==================== AGENT 1: Discovery Coordinator ====================
    const discoveryAgentId = generateId()
    schedule(3500, () => {
      incrementStep()
      addAgentToMessage({
        id: discoveryAgentId,
        name: "Discovery Coordinator",
        task: "Search listing sites for acquisition targets matching investment thesis",
        status: "initializing",
        agentLevel: 1,
        timestamp: new Date(),
        duration: null,
        progress: { current: 0, total: 7 },
        subtasks: [
          { id: "d1", name: "Parse investment thesis criteria", status: "pending" },
          { id: "d2", name: "Search BizBuySell for listings", status: "pending" },
          { id: "d3", name: "Search BizQuest for listings", status: "pending" },
          { id: "d4", name: "Search LoopNet commercial listings", status: "pending" },
          { id: "d5", name: "Search Acquire.com marketplace", status: "pending" },
          { id: "d6", name: "Deduplicate and merge results", status: "pending" },
          { id: "d7", name: "Apply initial scoring filter", status: "pending" },
        ],
        toolCalls: [],
        childAgents: [],
      })
    })

    schedule(4000, () => {
      updateAgent(discoveryAgentId, { status: "working" })
      updateAgentSubtask(discoveryAgentId, 0, { status: "running" })
    })

    // Discovery tool calls
    const webSearch1Id = generateId()
    schedule(4500, () => {
      incrementStep()
      updateAgentSubtask(discoveryAgentId, 0, { status: "complete" })
      updateAgentSubtask(discoveryAgentId, 1, { status: "running" })
      updateAgent(discoveryAgentId, { progress: { current: 1, total: 7 } })
      addToolToAgent(discoveryAgentId, {
        id: webSearch1Id,
        name: "web_search",
        displayName: "WebSearch: HVAC business for sale Atlanta",
        icon: "WS",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { query: "HVAC business for sale Atlanta metro area" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const webSearch2Id = generateId()
    schedule(5200, () => {
      incrementStep()
      updateTool(webSearch1Id, { status: "success", duration: 1.2, result: { results: 23 } })
      updateAgentSubtask(discoveryAgentId, 1, { status: "complete" })
      updateAgentSubtask(discoveryAgentId, 2, { status: "running" })
      updateAgent(discoveryAgentId, { progress: { current: 2, total: 7 } })
      addFile({ id: "f6", name: "bizbuysell_listings.json", type: "file", language: "json", status: "created" })
      addToolToAgent(discoveryAgentId, {
        id: webSearch2Id,
        name: "web_search",
        displayName: "WebSearch: plumbing company for sale Georgia",
        icon: "WS",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { query: "plumbing company for sale Georgia under $2M" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const webFetch1Id = generateId()
    schedule(6100, () => {
      incrementStep()
      updateTool(webSearch2Id, { status: "success", duration: 0.9, result: { results: 18 } })
      updateAgentSubtask(discoveryAgentId, 2, { status: "complete" })
      updateAgentSubtask(discoveryAgentId, 3, { status: "running" })
      updateAgent(discoveryAgentId, { progress: { current: 3, total: 7 } })
      addFile({ id: "f7", name: "bizquest_listings.json", type: "file", language: "json", status: "created" })
      addToolToAgent(discoveryAgentId, {
        id: webFetch1Id,
        name: "web_fetch",
        displayName: "WebFetch: bizbuysell.com/listing/...",
        icon: "WF",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { url: "bizbuysell.com/listing/hvac-atlanta-234892" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const bashId = generateId()
    schedule(7000, () => {
      incrementStep()
      updateTool(webFetch1Id, { status: "success", duration: 0.8, result: { fetched: true } })
      updateAgentSubtask(discoveryAgentId, 3, { status: "complete" })
      updateAgentSubtask(discoveryAgentId, 4, { status: "complete" })
      updateAgentSubtask(discoveryAgentId, 5, { status: "running" })
      updateAgent(discoveryAgentId, { progress: { current: 5, total: 7 } })
      addFile({ id: "f8", name: "loopnet_listings.json", type: "file", language: "json", status: "created" })
      addToolToAgent(discoveryAgentId, {
        id: bashId,
        name: "bash",
        displayName: "Bash: python deduplicate.py",
        icon: "SH",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { command: "python deduplicate.py --sources=4" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    schedule(7500, () => {
      incrementStep()
      updateTool(bashId, { status: "success", duration: 0.3, result: { deduplicated: 67 } })
      updateAgentSubtask(discoveryAgentId, 5, { status: "complete" })
      updateAgentSubtask(discoveryAgentId, 6, { status: "running" })
      updateAgent(discoveryAgentId, { progress: { current: 6, total: 7 } })
    })

    schedule(8200, () => {
      incrementStep()
      updateAgentSubtask(discoveryAgentId, 6, { status: "complete" })
      updateAgent(discoveryAgentId, { 
        status: "complete", 
        progress: { current: 7, total: 7 },
        duration: 8.2 
      })
      addFile({ id: "f9", name: "raw_listings.json", type: "file", language: "json", status: "created" })
    })

    // ==================== AGENT 2: Enrichment Specialist ====================
    const enrichmentAgentId = generateId()
    schedule(8500, () => {
      incrementStep()
      addAgentToMessage({
        id: enrichmentAgentId,
        name: "Enrichment Specialist",
        task: "Enrich listings with company data, reviews, tech stack, owner research",
        status: "initializing",
        agentLevel: 1,
        timestamp: new Date(),
        duration: null,
        progress: { current: 0, total: 6 },
        subtasks: [
          { id: "e1", name: "Fetch company websites", status: "pending" },
          { id: "e2", name: "Analyze online presence", status: "pending" },
          { id: "e3", name: "Research owner profiles", status: "pending" },
          { id: "e4", name: "Aggregate Google/Yelp reviews", status: "pending" },
          { id: "e5", name: "Detect technology stack", status: "pending" },
          { id: "e6", name: "Map competitive landscape", status: "pending" },
        ],
        toolCalls: [],
        childAgents: [],
      })
    })

    schedule(9000, () => {
      updateAgent(enrichmentAgentId, { status: "working" })
      updateAgentSubtask(enrichmentAgentId, 0, { status: "running" })
    })

    const enrichWebSearch1Id = generateId()
    schedule(9500, () => {
      incrementStep()
      addToolToAgent(enrichmentAgentId, {
        id: enrichWebSearch1Id,
        name: "web_search",
        displayName: "WebSearch: Marietta HVAC Services owner",
        icon: "WS",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { query: "Marietta HVAC Services owner LinkedIn" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const enrichWebFetch1Id = generateId()
    schedule(10600, () => {
      incrementStep()
      updateTool(enrichWebSearch1Id, { status: "success", duration: 1.1, result: { profiles: 3 } })
      updateAgentSubtask(enrichmentAgentId, 0, { status: "complete" })
      updateAgentSubtask(enrichmentAgentId, 1, { status: "running" })
      updateAgent(enrichmentAgentId, { progress: { current: 1, total: 6 } })
      addToolToAgent(enrichmentAgentId, {
        id: enrichWebFetch1Id,
        name: "web_fetch",
        displayName: "WebFetch: mariettahvac.com",
        icon: "WF",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { url: "mariettahvac.com" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const enrichWebSearch2Id = generateId()
    schedule(11200, () => {
      incrementStep()
      updateTool(enrichWebFetch1Id, { status: "success", duration: 0.6, result: { pages: 12 } })
      updateAgentSubtask(enrichmentAgentId, 1, { status: "complete" })
      updateAgentSubtask(enrichmentAgentId, 2, { status: "running" })
      updateAgent(enrichmentAgentId, { progress: { current: 2, total: 6 } })
      addToolToAgent(enrichmentAgentId, {
        id: enrichWebSearch2Id,
        name: "web_search",
        displayName: "WebSearch: Marietta HVAC reviews",
        icon: "WS",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { query: "Marietta HVAC Services reviews Google Yelp" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const builtWithId = generateId()
    schedule(12000, () => {
      incrementStep()
      updateTool(enrichWebSearch2Id, { status: "success", duration: 0.8, result: { reviews: 47 } })
      updateAgentSubtask(enrichmentAgentId, 2, { status: "complete" })
      updateAgentSubtask(enrichmentAgentId, 3, { status: "complete" })
      updateAgentSubtask(enrichmentAgentId, 4, { status: "running" })
      updateAgent(enrichmentAgentId, { progress: { current: 4, total: 6 } })
      addToolToAgent(enrichmentAgentId, {
        id: builtWithId,
        name: "builtwith_api",
        displayName: "BuiltWith API: mariettahvac.com",
        icon: "BW",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { domain: "mariettahvac.com" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    schedule(13400, () => {
      incrementStep()
      updateTool(builtWithId, { status: "success", duration: 1.4, result: { technologies: 8 } })
      updateAgentSubtask(enrichmentAgentId, 4, { status: "complete" })
      updateAgentSubtask(enrichmentAgentId, 5, { status: "running" })
      updateAgent(enrichmentAgentId, { progress: { current: 5, total: 6 } })
    })

    schedule(14400, () => {
      incrementStep()
      updateAgentSubtask(enrichmentAgentId, 5, { status: "complete" })
      updateAgent(enrichmentAgentId, { 
        status: "complete", 
        progress: { current: 6, total: 6 },
        duration: 12.4 
      })
      addFile({ id: "f10", name: "enriched_listings.json", type: "file", language: "json", status: "created" })
    })

    // ==================== AGENT 3: Financial Analyst ====================
    const financialAgentId = generateId()
    schedule(14700, () => {
      incrementStep()
      addAgentToMessage({
        id: financialAgentId,
        name: "Financial Analyst",
        task: "Analyze financials, calculate SDE, assess valuations",
        status: "initializing",
        agentLevel: 1,
        timestamp: new Date(),
        duration: null,
        progress: { current: 0, total: 6 },
        subtasks: [
          { id: "fn1", name: "Calculate SDE from listing data", status: "pending" },
          { id: "fn2", name: "Assess revenue trends", status: "pending" },
          { id: "fn3", name: "Compare to industry multiples", status: "pending" },
          { id: "fn4", name: "Model debt capacity (SBA 7a)", status: "pending" },
          { id: "fn5", name: "Identify financial red flags", status: "pending" },
          { id: "fn6", name: "Generate valuation assessment", status: "pending" },
        ],
        toolCalls: [],
        childAgents: [],
      })
    })

    schedule(15200, () => {
      updateAgent(financialAgentId, { status: "working" })
      updateAgentSubtask(financialAgentId, 0, { status: "running" })
    })

    const calcSdeId = generateId()
    schedule(15700, () => {
      incrementStep()
      addToolToAgent(financialAgentId, {
        id: calcSdeId,
        name: "calculator",
        displayName: "Calculator: SDE calculation",
        icon: "CA",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { operation: "sde_calculation", listings: 34 },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const industryCompsId = generateId()
    schedule(16100, () => {
      incrementStep()
      updateTool(calcSdeId, { status: "success", duration: 0.4, result: { calculated: 34 } })
      updateAgentSubtask(financialAgentId, 0, { status: "complete" })
      updateAgentSubtask(financialAgentId, 1, { status: "complete" })
      updateAgentSubtask(financialAgentId, 2, { status: "running" })
      updateAgent(financialAgentId, { progress: { current: 2, total: 6 } })
      addToolToAgent(financialAgentId, {
        id: industryCompsId,
        name: "industry_comps",
        displayName: "IndustryComps: HVAC Southeast 2025",
        icon: "IC",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { industry: "HVAC", region: "Southeast", year: 2025 },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const debtCalcId = generateId()
    schedule(17900, () => {
      incrementStep()
      updateTool(industryCompsId, { status: "success", duration: 1.8, result: { multiples: { low: 2.1, median: 2.8, high: 3.5 } } })
      updateAgentSubtask(financialAgentId, 2, { status: "complete" })
      updateAgentSubtask(financialAgentId, 3, { status: "running" })
      updateAgent(financialAgentId, { progress: { current: 3, total: 6 } })
      addToolToAgent(financialAgentId, {
        id: debtCalcId,
        name: "calculator",
        displayName: "Calculator: Debt service coverage",
        icon: "CA",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { operation: "dscr_calculation", sba7a: true },
        result: null,
        error: null,
        expanded: false,
      })
    })

    schedule(18200, () => {
      incrementStep()
      updateTool(debtCalcId, { status: "success", duration: 0.3, result: { avgDscr: 1.42 } })
      updateAgentSubtask(financialAgentId, 3, { status: "complete" })
      updateAgentSubtask(financialAgentId, 4, { status: "running" })
      updateAgent(financialAgentId, { progress: { current: 4, total: 6 } })
    })

    schedule(18800, () => {
      incrementStep()
      updateAgentSubtask(financialAgentId, 4, { status: "complete" })
      updateAgentSubtask(financialAgentId, 5, { status: "running" })
      updateAgent(financialAgentId, { progress: { current: 5, total: 6 } })
    })

    schedule(19600, () => {
      incrementStep()
      updateAgentSubtask(financialAgentId, 5, { status: "complete" })
      updateAgent(financialAgentId, { 
        status: "complete", 
        progress: { current: 6, total: 6 },
        duration: 9.6 
      })
      addFile({ id: "f11", name: "AP-2026-00001_analysis.json", type: "file", language: "json", status: "created" })
      addFile({ id: "f12", name: "AP-2026-00002_analysis.json", type: "file", language: "json", status: "created" })
    })

    // ==================== AGENT 4: AI Opportunity Analyst ====================
    const aiAgentId = generateId()
    schedule(19900, () => {
      incrementStep()
      addAgentToMessage({
        id: aiAgentId,
        name: "AI Opportunity Analyst",
        task: "Identify AI automation opportunities and model ROI",
        status: "initializing",
        agentLevel: 1,
        timestamp: new Date(),
        duration: null,
        progress: { current: 0, total: 6 },
        subtasks: [
          { id: "ai1", name: "Map operational workflows", status: "pending" },
          { id: "ai2", name: "Extract pain points from reviews", status: "pending" },
          { id: "ai3", name: "Match to AI solution taxonomy", status: "pending" },
          { id: "ai4", name: "Model ROI for each opportunity", status: "pending" },
          { id: "ai5", name: "Create implementation roadmaps", status: "pending" },
          { id: "ai6", name: "Calculate AI opportunity scores", status: "pending" },
        ],
        toolCalls: [],
        childAgents: [],
      })
    })

    schedule(20400, () => {
      updateAgent(aiAgentId, { status: "working" })
      updateAgentSubtask(aiAgentId, 0, { status: "running" })
    })

    const taxonomyMatcherId = generateId()
    schedule(20900, () => {
      incrementStep()
      updateAgentSubtask(aiAgentId, 0, { status: "complete" })
      updateAgentSubtask(aiAgentId, 1, { status: "complete" })
      updateAgentSubtask(aiAgentId, 2, { status: "running" })
      updateAgent(aiAgentId, { progress: { current: 2, total: 6 } })
      addToolToAgent(aiAgentId, {
        id: taxonomyMatcherId,
        name: "taxonomy_matcher",
        displayName: "TaxonomyMatcher: HVAC scheduling",
        icon: "TM",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { workflow: "HVAC scheduling", industry: "home services" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const roiCalc1Id = generateId()
    schedule(21500, () => {
      incrementStep()
      updateTool(taxonomyMatcherId, { status: "success", duration: 0.6, result: { matches: 4 } })
      updateAgentSubtask(aiAgentId, 2, { status: "complete" })
      updateAgentSubtask(aiAgentId, 3, { status: "running" })
      updateAgent(aiAgentId, { progress: { current: 3, total: 6 } })
      addToolToAgent(aiAgentId, {
        id: roiCalc1Id,
        name: "roi_calculator",
        displayName: "ROICalculator: AI Voice Agent",
        icon: "RC",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { solution: "AI Voice Agent", calls_per_month: 450 },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const roiCalc2Id = generateId()
    schedule(22300, () => {
      incrementStep()
      updateTool(roiCalc1Id, { status: "success", duration: 0.8, result: { annual_savings: 85000 } })
      addToolToAgent(aiAgentId, {
        id: roiCalc2Id,
        name: "roi_calculator",
        displayName: "ROICalculator: Smart Dispatch",
        icon: "RC",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { solution: "Smart Dispatch", technicians: 8 },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const writeAiId = generateId()
    schedule(23000, () => {
      incrementStep()
      updateTool(roiCalc2Id, { status: "success", duration: 0.7, result: { annual_savings: 120000 } })
      updateAgentSubtask(aiAgentId, 3, { status: "complete" })
      updateAgentSubtask(aiAgentId, 4, { status: "running" })
      updateAgent(aiAgentId, { progress: { current: 4, total: 6 } })
      addToolToAgent(aiAgentId, {
        id: writeAiId,
        name: "write",
        displayName: "Write: ai_analysis.json",
        icon: "WR",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { file: "ai_analysis.json" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    schedule(23200, () => {
      incrementStep()
      updateTool(writeAiId, { status: "success", duration: 0.2, result: { written: true } })
      updateAgentSubtask(aiAgentId, 4, { status: "complete" })
      updateAgentSubtask(aiAgentId, 5, { status: "running" })
      updateAgent(aiAgentId, { progress: { current: 5, total: 6 } })
    })

    schedule(23800, () => {
      incrementStep()
      updateAgentSubtask(aiAgentId, 5, { status: "complete" })
      updateAgent(aiAgentId, { 
        status: "complete", 
        progress: { current: 6, total: 6 },
        duration: 7.8 
      })
      addFile({ id: "f13", name: "AP-2026-00001_ai_report.json", type: "file", language: "json", status: "created" })
      addFile({ id: "f14", name: "final_rankings.json", type: "file", language: "json", status: "created", url: "/outputs/final_rankings.json" })
    })

    // ==================== AGENT 5: Document Generator ====================
    const docAgentId = generateId()
    schedule(24100, () => {
      incrementStep()
      addAgentToMessage({
        id: docAgentId,
        name: "Document Generator",
        task: "Generate investment memos, executive summaries, outreach emails",
        status: "initializing",
        agentLevel: 1,
        timestamp: new Date(),
        duration: null,
        progress: { current: 0, total: 5 },
        subtasks: [
          { id: "doc1", name: "Generate executive summaries (top 5)", status: "pending" },
          { id: "doc2", name: "Create investment memos", status: "pending" },
          { id: "doc3", name: "Build AI opportunity reports", status: "pending" },
          { id: "doc4", name: "Draft broker outreach emails", status: "pending" },
          { id: "doc5", name: "Prepare lender presentations", status: "pending" },
        ],
        toolCalls: [],
        childAgents: [],
      })
    })

    schedule(24600, () => {
      updateAgent(docAgentId, { status: "working" })
      updateAgentSubtask(docAgentId, 0, { status: "running" })
    })

    const docxId = generateId()
    schedule(25100, () => {
      incrementStep()
      addToolToAgent(docAgentId, {
        id: docxId,
        name: "python_docx",
        displayName: "python-docx: investment_memo.docx",
        icon: "PD",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { template: "investment_memo", company: "Marietta HVAC" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const weasprintId = generateId()
    schedule(27200, () => {
      incrementStep()
      updateTool(docxId, { status: "success", duration: 2.1, result: { pages: 8 } })
      updateAgentSubtask(docAgentId, 0, { status: "complete" })
      updateAgentSubtask(docAgentId, 1, { status: "complete" })
      updateAgentSubtask(docAgentId, 2, { status: "running" })
      updateAgent(docAgentId, { progress: { current: 2, total: 5 } })
      addFile({ id: "f15", name: "AP-2026-00001_Investment_Memo.docx", type: "file", language: "docx", status: "created", url: "/outputs/AP-2026-00001_Investment_Memo.docx" })
      addToolToAgent(docAgentId, {
        id: weasprintId,
        name: "weasyprint",
        displayName: "weasyprint: executive_summary.pdf",
        icon: "WP",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { format: "pdf", template: "executive_summary" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const pptxId = generateId()
    schedule(29000, () => {
      incrementStep()
      updateTool(weasprintId, { status: "success", duration: 1.8, result: { pages: 2 } })
      updateAgentSubtask(docAgentId, 2, { status: "complete" })
      updateAgentSubtask(docAgentId, 3, { status: "running" })
      updateAgent(docAgentId, { progress: { current: 3, total: 5 } })
      addFile({ id: "f16", name: "AP-2026-00001_Executive_Summary.pdf", type: "file", language: "pdf", status: "created", url: "/outputs/AP-2026-00001_Executive_Summary.pdf" })
      addFile({ id: "f17", name: "AP-2026-00001_AI_Opportunity_Report.pdf", type: "file", language: "pdf", status: "created", url: "/outputs/AP-2026-00001_AI_Opportunity_Report.pdf" })
      addToolToAgent(docAgentId, {
        id: pptxId,
        name: "python_pptx",
        displayName: "python-pptx: lender_presentation.pptx",
        icon: "PP",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { template: "sba_lender", slides: 12 },
        result: null,
        error: null,
        expanded: false,
      })
    })

    const writeEmailId = generateId()
    schedule(31400, () => {
      incrementStep()
      updateTool(pptxId, { status: "success", duration: 2.4, result: { slides: 12 } })
      updateAgentSubtask(docAgentId, 3, { status: "complete" })
      updateAgentSubtask(docAgentId, 4, { status: "running" })
      updateAgent(docAgentId, { progress: { current: 4, total: 5 } })
      addFile({ id: "f18", name: "AP-2026-00001_Lender_Presentation.pptx", type: "file", language: "pptx", status: "created", url: "/outputs/AP-2026-00001_Lender_Presentation.pptx" })
      addToolToAgent(docAgentId, {
        id: writeEmailId,
        name: "write",
        displayName: "Write: outreach_email_broker.txt",
        icon: "WR",
        status: "running",
        timestamp: new Date(),
        duration: null,
        input: { file: "outreach_email_broker.txt" },
        result: null,
        error: null,
        expanded: false,
      })
    })

    schedule(31900, () => {
      incrementStep()
      updateTool(writeEmailId, { status: "success", duration: 0.5, result: { written: true } })
      updateAgentSubtask(docAgentId, 4, { status: "complete" })
      updateAgent(docAgentId, { 
        status: "complete", 
        progress: { current: 5, total: 5 },
        duration: 11.3 
      })
      addFile({ id: "f19", name: "AP-2026-00001_Outreach_Email.txt", type: "file", language: "txt", status: "created", url: "/outputs/AP-2026-00001_Outreach_Email.txt" })
    })

    // Final message
    schedule(33000, () => {
      incrementStep()
      updateLastMessage({
        isStreaming: false,
        content: `I've completed sourcing and analyzing acquisition targets matching your investment thesis.

**Pipeline Summary:**
- Discovery: Searched 4 listing marketplaces, found 67 potential targets
- Enrichment: Enhanced 34 qualified listings with company data
- Financial Analysis: Deep-dive analysis on top 20 candidates
- AI Opportunity: Identified automation potential worth $265K avg/year
- Documents: Generated deal packages for top 5 opportunities

**Top 3 Recommendations:**

1. **Marietta HVAC Services** — Score: 84/100
   Marietta, GA | $1.2M asking | $385K SDE
   Strong AI opportunity: $265K annual value creation potential

2. **Comfort Pro Plumbing** — Score: 79/100
   Alpharetta, GA | $890K asking | $275K SDE
   Owner retiring (age 64), motivated seller

3. **Metro Mechanical** — Score: 76/100
   Kennesaw, GA | $1.5M asking | $420K SDE
   Includes real estate, excellent reviews (4.8 stars)

**Your deal packages are ready:**
- Executive summaries and investment memos for each opportunity
- AI transformation roadmaps with ROI projections
- Draft outreach emails to brokers
- SBA loan-ready lender presentations

The swarm completed 5 specialized agents working in sequence, executing 23 tool calls, and generating 18 files in 49.3 seconds.`,
      })
      setIsPlaying(false)
    })

    setCurrentStep(0)
  }, [
    reset,
    addMessage,
    updateLastMessage,
    addAgentToMessage,
    updateAgent,
    addToolToAgent,
    updateTool,
    updateAgentSubtask,
    addFile,
  ])

  return {
    messages,
    files,
    isPlaying,
    currentStep,
    totalSteps: 35,
    runAcquisitionScenario,
    reset,
  }
}
