import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          vibe-engineering
        </h1>

        <p className="mt-4 text-muted-foreground">
          A modern frontend foundation with React, TanStack Router,
          Tailwind CSS, and shadcn/ui. Deployed to Cloudflare Workers.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link to="/workflow">Workflow Prompts</Link>
          </Button>
          <Button variant="outline">Documentation</Button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {['React', 'Vite', 'TypeScript', 'Tailwind', 'shadcn/ui'].map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-secondary text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
