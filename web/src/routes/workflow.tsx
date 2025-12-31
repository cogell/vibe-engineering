import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/workflow')({
  component: WorkflowPage,
})

type Phase = 'brainstorm' | 'plan' | 'execute' | 'verify' | 'compounding'

interface Step {
  phase: Phase
  trigger: string
  prompt: string
  doneCheck: string
  attribution?: string
}

interface PhaseGroupData {
  phase: Phase
  steps: { step: Step; originalIndex: number }[]
}

function groupStepsByPhase(steps: Step[]): PhaseGroupData[] {
  const groups: PhaseGroupData[] = []

  steps.forEach((step, index) => {
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.phase === step.phase) {
      lastGroup.steps.push({ step, originalIndex: index })
    } else {
      groups.push({ phase: step.phase, steps: [{ step, originalIndex: index }] })
    }
  })

  return groups
}

const steps: Step[] = [
  {
    phase: 'brainstorm',
    trigger: 'When you have a vague idea and need to explore directions',
    prompt: `Help me brainstorm ideas for [topic]. Consider different angles, potential challenges, and creative approaches. What are the key questions we should be asking?`,
    doneCheck: 'Ideas explored & direction chosen',
  },
  {
    phase: 'brainstorm',
    trigger: 'When you need to deeply understand the system before building',
    prompt: `Now please take all that and write me a single Markdown doc with a deep, detailed guide for a dev to implement the change, including teaching me background and context about the broader surrounding system, and rationale behind why we're doing things a certain way.`,
    doneCheck: 'Concepts understood & documented',
  },
  {
    phase: 'plan',
    trigger: 'When you know what to build, create tasks as beads...',
    prompt: `OK so please take ALL of that and elaborate on it more and then create a comprehensive and granular set of beads for all this with tasks, subtasks, and dependency structure overlaid, with detailed comments so that the whole thing is totally self-contained and self-documenting (including relevant background, reasoning/justification, considerations, etc.-- anything we'd want our "future self" to know about the goals and intentions and thought process and how it serves the over-arching goals of the project.)`,
    doneCheck: 'Beads created',
    attribution: '@doodlestein',
  },
  {
    phase: 'plan',
    trigger: 'When beads are made, dbl check them',
    prompt: `Check over each bead super carefully-- are you sure it makes sense? Is it optimal? Could we change anything to make the system work better for users? If so, revise the beads. It's a lot easier and faster to operate in "plan space" before we start implementing these things!`,
    doneCheck: 'Plan reviewed & approved',
    attribution: '@doodlestein',
  },
  {
    phase: 'execute',
    trigger: 'When beads are good and it\'s time to build',
    prompt: `OK, so start systematically and methodically and meticulously and diligently executing those remaining beads tasks that you created in the optimal logical order! Don't forget to mark beads as you work on them.`,
    doneCheck: 'All tasks completed',
    attribution: '@doodlestein',
  },
  {
    phase: 'verify',
    trigger: 'When build is done and you need to review',
    prompt: `Great, now I want you to carefully read over all of the new code you just wrote and other existing code you just modified with "fresh eyes" looking super carefully for any obvious bugs, errors, problems, issues, confusion, etc. Carefully fix anything you uncover.`,
    doneCheck: 'Quality verified & shipped',
    attribution: '@doodlestein',
  },
]

const phaseConfig: Record<Phase, { label: string; color: string }> = {
  brainstorm: { label: 'Brainstorming', color: 'bg-chart-1' },
  plan: { label: 'Planning', color: 'bg-chart-2' },
  execute: { label: 'Execution', color: 'bg-chart-3' },
  verify: { label: 'Verifying', color: 'bg-chart-4' },
  compounding: { label: 'Compounding', color: 'bg-chart-5' },
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="shrink-0"
    >
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  )
}

function PhaseConnector({
  checked,
  onToggle,
  label
}: {
  checked: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <div className="flex flex-col items-center py-2">
      {/* Top line */}
      <div className="h-4 w-px bg-border" />

      {/* Checkbox in the middle */}
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-2 px-3 py-1.5 border text-xs
          transition-colors cursor-pointer
          ${checked
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-muted-foreground border-border hover:border-primary/50'
          }
        `}
      >
        <span
          className={`
            flex h-4 w-4 items-center justify-center border
            ${checked ? 'bg-primary-foreground border-primary-foreground' : 'border-current'}
          `}
        >
          {checked && (
            <svg
              className="h-3 w-3 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <span>{label}</span>
      </button>

      {/* Bottom line */}
      <div className="h-4 w-px bg-border" />
    </div>
  )
}

function PhaseGroupTrack({ phase }: { phase: Phase }) {
  const config = phaseConfig[phase]

  return (
    <div className={`flex items-center justify-center w-6 shrink-0 mr-4 ${config.color}`}>
      <span className="[writing-mode:vertical-rl] rotate-180 text-sm font-semibold text-primary-foreground tracking-widest uppercase py-4">
        {config.label}
      </span>
    </div>
  )
}

function PhaseGroup({
  group,
  completedChecks,
  toggleCheck,
}: {
  group: PhaseGroupData
  completedChecks: Record<number, boolean>
  toggleCheck: (index: number) => void
}) {
  return (
    <div className="flex">
      {/* Left track */}
      <PhaseGroupTrack phase={group.phase} />

      {/* Cards */}
      <div className="flex-1 flex flex-col">
        {group.steps.map(({ step, originalIndex }, i) => (
          <div key={originalIndex}>
            <StepCard step={step} index={originalIndex} />

            {/* Connector within group (not after last card in group) */}
            {i < group.steps.length - 1 && (
              <PhaseConnector
                checked={!!completedChecks[originalIndex]}
                onToggle={() => toggleCheck(originalIndex)}
                label={step.doneCheck}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PhaseTransition({
  fromStep,
  checked,
  onToggle,
}: {
  fromStep: Step
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex">
      {/* Empty space to align with track */}
      <div className="w-6 shrink-0 mr-4" />

      {/* Connector */}
      <div className="flex-1">
        <PhaseConnector
          checked={checked}
          onToggle={onToggle}
          label={fromStep.doneCheck}
        />
      </div>
    </div>
  )
}

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-muted text-sm font-medium">
            {index + 1}
          </span>
          <span className="flex-1 text-sm text-muted-foreground">
            {step.trigger}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex-1">
            <pre className="whitespace-pre-wrap bg-muted p-3 text-sm font-mono">
              {step.prompt}
            </pre>
            {step.attribution && (
              <div className="mt-2 text-right text-xs text-muted-foreground">
                —{' '}
                {step.attribution.startsWith('@') ? (
                  <a
                    href={`https://x.com/${step.attribution.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground underline underline-offset-2"
                  >
                    {step.attribution}
                  </a>
                ) : (
                  step.attribution
                )}
              </div>
            )}
          </div>
          <CopyButton text={step.prompt} />
        </div>
      </CardContent>
    </Card>
  )
}

function WorkflowPage() {
  const [completedChecks, setCompletedChecks] = useState<Record<number, boolean>>({})
  const groups = groupStepsByPhase(steps)

  const toggleCheck = (index: number) => {
    setCompletedChecks(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight">Workflow Prompts</h1>
        <p className="mt-2 text-muted-foreground">
          A series of prompts to guide you through each phase of work.
          Check off each gate before moving to the next phase.
        </p>

        <div className="mt-8 flex flex-col">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <PhaseGroup
                group={group}
                completedChecks={completedChecks}
                toggleCheck={toggleCheck}
              />

              {/* Connector between groups */}
              {groupIndex < groups.length - 1 && (
                <PhaseTransition
                  fromStep={group.steps[group.steps.length - 1].step}
                  checked={!!completedChecks[group.steps[group.steps.length - 1].originalIndex]}
                  onToggle={() => toggleCheck(group.steps[group.steps.length - 1].originalIndex)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
