import Link from 'next/link'
import { ProjectCard } from '@/components/public/ProjectCard'

const projects = [
  {
    title: 'NASA SUITS AR Interface',
    subtitle: 'HoloLens AR for Astronauts',
    description: 'Designing and developing augmented reality overlays for astronaut EVA suits, integrating real-time telemetry, navigation waypoints, and geological data into a hands-free HoloLens display.',
    tags: ['AR/VR', 'HoloLens', 'C#', 'Unity', 'NASA SUITS'],
    status: 'active' as const,
  },
  {
    title: 'NASA RASC-AL Proposal',
    subtitle: 'Lunar Resource Architecture',
    description: 'A comprehensive technical paper proposing an innovative in-situ resource utilization architecture for sustainable long-duration lunar missions, including propellant production and life support.',
    tags: ['Systems Design', 'Propulsion', 'ISRU', 'NASA RASC-AL'],
    status: 'active' as const,
  },
  {
    title: 'Autonomous Rover',
    subtitle: 'Surface Exploration Platform',
    description: 'Building a fully autonomous ground vehicle with LiDAR-based SLAM navigation, onboard computer vision for obstacle detection, and a modular science instrument payload.',
    tags: ['ROS2', 'Python', 'LiDAR', 'OpenCV', 'Embedded'],
    status: 'active' as const,
  },
  {
    title: 'Telemetry Dashboard',
    subtitle: 'Real-Time Mission Data Visualization',
    description: 'A web-based dashboard for monitoring live telemetry streams from our rover and AR system during testing. Includes sensor plots, alert thresholds, and logging.',
    tags: ['React', 'TypeScript', 'WebSockets', 'Grafana'],
    status: 'completed' as const,
  },
  {
    title: 'Member Portal',
    subtitle: 'Internal Team Management Platform',
    description: 'A Next.js application for managing team membership, subteam assignments, meeting attendance, and project updates across all 9 CLAWS subteams.',
    tags: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind'],
    status: 'completed' as const,
  },
  {
    title: 'Outreach Curriculum',
    subtitle: 'K-12 Space Engineering Modules',
    description: 'Developing a modular STEM curriculum for K-12 outreach events, teaching fundamental aerospace concepts through hands-on activities and interactive demonstrations.',
    tags: ['Education', 'STEM', 'Curriculum Design'],
    status: 'upcoming' as const,
  },
]

export default function ProjectsPage() {
  const active = projects.filter((p) => p.status === 'active')
  const completed = projects.filter((p) => p.status === 'completed')
  const upcoming = projects.filter((p) => p.status === 'upcoming')

  return (
    <div className="min-h-screen bg-space">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white-50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span>/</span>
            <span className="text-white-90">Projects</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">What We Build</p>
            <h1 className="text-display-xl text-white mb-6">Our Projects</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              From NASA-competition hardware to internal tooling — every CLAWS project is student-led, technically rigorous, and built to impress.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Active */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-status-active animate-pulse" />
            <h2 className="text-display-sm text-white-90">Active Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.map((p) => <ProjectCard key={p.title} {...p} />)}
          </div>
        </div>

        {/* Completed */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-white-50" />
            <h2 className="text-display-sm text-white-90">Completed Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completed.map((p) => <ProjectCard key={p.title} {...p} />)}
          </div>
        </div>

        {/* Upcoming */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-nebula" />
            <h2 className="text-display-sm text-white-90">Upcoming Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((p) => <ProjectCard key={p.title} {...p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
