import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Brain-Rot</h1>
        <p className="text-xl text-muted-foreground mb-8">Canvas Animation Gallery</p>
        <div className="text-sm text-muted-foreground">
          Project scaffolding complete. Animation gallery coming soon...
        </div>
      </div>
    </div>
  )
}
