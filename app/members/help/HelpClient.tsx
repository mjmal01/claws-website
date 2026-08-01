'use client'

import { useState } from 'react'
import type { MemberRole, SubteamSlug } from '@/lib/supabase'

// ─── Static link data ─────────────────────────────────────────────────────────

interface StaticLink {
  icon: string
  label: string
  href: string
}

const WELCOME_LINKS: StaticLink[] = [
  { icon: '📄', label: 'Welcome Guide',      href: '#' },
  { icon: '📄', label: 'Code of Conduct',    href: '#' },
  { icon: '📄', label: 'Org Overview',       href: '#' },
  { icon: '📄', label: 'Slack Guide',        href: '#' },
  { icon: '📄', label: 'Member Handbook',    href: '#' },
  { icon: '📅', label: 'Academic Calendar',  href: '#' },
]

const MEMBER_RESOURCES: StaticLink[] = [
  { icon: '📁', label: 'Subteam Files',     href: '#' },
  { icon: '📄', label: 'Brief',             href: '#' },
  { icon: '📝', label: 'Meeting Notes',     href: '#' },
  { icon: '📘', label: 'Onboarding Doc',    href: '#' },
]

const LEAD_RESOURCES: StaticLink[] = [
  { icon: '📄', label: 'Lead Handbook',     href: '#' },
  { icon: '👥', label: 'Member Roster',     href: '#' },
  { icon: '💰', label: 'Subteam Budget',    href: '#' },
  { icon: '📋', label: 'Recruiting Notes',  href: '#' },
]

const ALL_TEAM_LINKS: StaticLink[] = [
  { icon: '📝', label: 'All-Hands Notes',   href: '#' },
  { icon: '📸', label: 'Photo Archive',     href: '#' },
  { icon: '🚀', label: 'SUITS Docs',        href: '#' },
  { icon: '🛰️', label: 'RASC-AL Docs',     href: '#' },
  { icon: '📋', label: 'NASA Guidelines',   href: '#' },
  { icon: '🚀', label: 'JSC Prep',          href: '#' },
]

const OTHER_SUBTEAM_LINKS: StaticLink[] = [
  { icon: '📁', label: 'Subteam Files',     href: '#' },
  { icon: '📄', label: 'Brief',             href: '#' },
  { icon: '📝', label: 'Meeting Notes',     href: '#' },
]

const LEADERSHIP_LINKS: StaticLink[] = [
  { icon: '💰', label: 'Full Budget',       href: '#' },
  { icon: '👥', label: 'Full Roster',       href: '#' },
  { icon: '🤝', label: 'Sponsor Deck',      href: '#' },
  { icon: '📋', label: 'Grant Docs',        href: '#' },
  { icon: '📄', label: 'Recruitment Plan',  href: '#' },
  { icon: '📋', label: 'Policy Docs',       href: '#' },
]

const FACULTY_LINKS: StaticLink[] = [
  { icon: '📋', label: 'IRB Protocols',     href: '#' },
  { icon: '📄', label: 'Research Docs',     href: '#' },
  { icon: '📊', label: 'Faculty Reports',   href: '#' },
  { icon: '📄', label: 'Grant Applications', href: '#' },
]

const ALL_SUBTEAMS: SubteamSlug[] = [
  'ar', 'ai', 'infrastructure', 'ux', 'hardware',
  'research', 'outreach', 'content', 'social',
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  userRole: MemberRole
  userSubteam: SubteamSlug | null
  subteamNames: Record<SubteamSlug, string>
  isLead: boolean
  isLeadership: boolean
  isFaculty: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HelpClient({
  userRole: _userRole,
  userSubteam,
  subteamNames,
  isLead,
  isLeadership,
  isFaculty,
}: Props) {
  const [search, setSearch] = useState('')
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['welcome', 'subteam', 'all_teams'])
  )
  const [openOtherSubteam, setOpenOtherSubteam] = useState<SubteamSlug | null>(null)

  const q = search.toLowerCase().trim()

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      return next
    })
  }

  function filterLinks(links: StaticLink[]): StaticLink[] {
    if (!q) return links
    return links.filter((l) => l.label.toLowerCase().includes(q))
  }

  const canSeeLeadResources = isLead || isLeadership
  const canSeeOtherSubteams = isLead || isLeadership

  const otherSubteams = ALL_SUBTEAMS.filter((s) => s !== userSubteam)

  // For search: flatten all visible links to check if anything matches
  const allVisibleLinks: StaticLink[] = [
    ...WELCOME_LINKS,
    ...MEMBER_RESOURCES,
    ...(canSeeLeadResources ? LEAD_RESOURCES : []),
    ...ALL_TEAM_LINKS,
    ...(canSeeOtherSubteams ? OTHER_SUBTEAM_LINKS : []),
    ...(isLeadership ? LEADERSHIP_LINKS : []),
    ...(isFaculty ? FACULTY_LINKS : []),
  ]

  const hasSearchResults = !q || allVisibleLinks.some((l) => l.label.toLowerCase().includes(q))

  const subteamDisplayName = userSubteam ? (subteamNames[userSubteam] ?? userSubteam) : null

  return (
    <div>
      {/* ── Search bar ──────────────────────────────────────────────────── */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources…"
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-nebula/50 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-sm transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {q && !hasSearchResults ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm">No resources found for &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="space-y-3">

          {/* ── Welcome to CLAWS ────────────────────────────────────────── */}
          {showSection(filterLinks(WELCOME_LINKS), q) && (
            <Section
              id="welcome"
              emoji="🌟"
              label="Welcome to CLAWS"
              isOpen={openSections.has('welcome')}
              onToggle={() => toggleSection('welcome')}
            >
              <p className="text-sm text-white/50 leading-relaxed mt-4 mb-4">
                Welcome to CLAWS — the Collaborative Lab for Advancing Work in Space at the University
                of Michigan. Here you&apos;ll find everything you need to contribute, collaborate, and
                launch your career in space systems.
              </p>
              <LinkGrid links={filterLinks(WELCOME_LINKS)} />
            </Section>
          )}

          {/* ── Your Subteam ─────────────────────────────────────────────── */}
          {userSubteam && showSection([...filterLinks(MEMBER_RESOURCES), ...(canSeeLeadResources ? filterLinks(LEAD_RESOURCES) : [])], q) && (
            <Section
              id="subteam"
              emoji="🔵"
              label={`Your Subteam — ${subteamDisplayName}`}
              accent="bg-blue-500/[0.04]"
              isOpen={openSections.has('subteam')}
              onToggle={() => toggleSection('subteam')}
            >
              <p className="text-sm text-white/50 leading-relaxed mt-4 mb-4">
                Your home base. Everything specific to the {subteamDisplayName} team.
              </p>

              {/* Member resources */}
              {filterLinks(MEMBER_RESOURCES).length > 0 && (
                <>
                  <SubSectionLabel label="Member Resources" />
                  <LinkGrid links={filterLinks(MEMBER_RESOURCES)} />
                </>
              )}

              {/* Lead resources */}
              {canSeeLeadResources && filterLinks(LEAD_RESOURCES).length > 0 && (
                <div className="mt-5">
                  <SubSectionLabel label="Lead Resources" />
                  <LinkGrid links={filterLinks(LEAD_RESOURCES)} />
                </div>
              )}
            </Section>
          )}

          {/* ── All Teams ────────────────────────────────────────────────── */}
          {showSection(filterLinks(ALL_TEAM_LINKS), q) && (
            <Section
              id="all_teams"
              emoji="🌐"
              label="All Teams"
              isOpen={openSections.has('all_teams')}
              onToggle={() => toggleSection('all_teams')}
            >
              <div className="mt-4">
                <LinkGrid links={filterLinks(ALL_TEAM_LINKS)} />
              </div>
            </Section>
          )}

          {/* ── Other Subteams accordion ─────────────────────────────────── */}
          {canSeeOtherSubteams && (
            <Section
              id="other_subteams"
              emoji="⚙️"
              label="Other Subteams"
              sublabel="Lead and leadership access"
              isOpen={openSections.has('other_subteams')}
              onToggle={() => toggleSection('other_subteams')}
            >
              <div className="mt-4 space-y-2">
                {/* Subteam pills row */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {otherSubteams.map((slug) => (
                    <button
                      key={slug}
                      onClick={() =>
                        setOpenOtherSubteam((prev) => (prev === slug ? null : slug))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        openOtherSubteam === slug
                          ? 'bg-maize text-black border-maize'
                          : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white/80'
                      }`}
                    >
                      {subteamNames[slug] ?? slug}
                    </button>
                  ))}
                </div>

                {/* Expanded subteam */}
                {openOtherSubteam && (
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-xs text-white/50 font-semibold mb-3">
                      {subteamNames[openOtherSubteam] ?? openOtherSubteam} — Resources
                    </p>
                    <LinkGrid links={filterLinks(OTHER_SUBTEAM_LINKS)} />
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* ── Leadership Only ──────────────────────────────────────────── */}
          {isLeadership && showSection(filterLinks(LEADERSHIP_LINKS), q) && (
            <Section
              id="leadership"
              emoji="🔐"
              label="Leadership Only"
              sublabel="Admin and org-level docs"
              isOpen={openSections.has('leadership')}
              onToggle={() => toggleSection('leadership')}
            >
              <div className="mt-4">
                <LinkGrid links={filterLinks(LEADERSHIP_LINKS)} />
              </div>
            </Section>
          )}

          {/* ── Faculty Only ─────────────────────────────────────────────── */}
          {isFaculty && showSection(filterLinks(FACULTY_LINKS), q) && (
            <Section
              id="faculty"
              emoji="🎓"
              label="Faculty Only"
              sublabel="Research and IRB docs"
              isOpen={openSections.has('faculty')}
              onToggle={() => toggleSection('faculty')}
            >
              <div className="mt-4">
                <LinkGrid links={filterLinks(FACULTY_LINKS)} />
              </div>
            </Section>
          )}

        </div>
      )}

      {/* Footer note */}
      <div className="mt-8 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
        <span className="text-sm">☁️</span>
        <p className="text-xs text-white/30">
          Files are hosted on Google Drive and open in a new tab. Links are managed by leadership.
          Contact <span className="text-white/50">claws-admin@umich.edu</span> to update.
        </p>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function showSection(filtered: StaticLink[], q: string): boolean {
  return !q || filtered.length > 0
}

function SubSectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-2">{label}</p>
  )
}

function LinkGrid({ links }: { links: StaticLink[] }) {
  if (links.length === 0) return null
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href !== '#' ? '_blank' : undefined}
          rel={link.href !== '#' ? 'noopener noreferrer' : undefined}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.07] hover:border-white/15 transition-all group"
        >
          <span className="text-base flex-shrink-0">{link.icon}</span>
          <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate">
            {link.label}
          </span>
          <span className="ml-auto text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0 text-xs">↗</span>
        </a>
      ))}
    </div>
  )
}

function Section({
  id,
  emoji,
  label,
  sublabel,
  accent,
  isOpen,
  onToggle,
  children,
}: {
  id: string
  emoji: string
  label: string
  sublabel?: string
  accent?: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  void id
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-colors ${accent ?? ''}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{emoji}</span>
          <div>
            <p className="font-semibold text-white text-sm">{label}</p>
            {sublabel && <p className="text-xs text-white/40 mt-0.5">{sublabel}</p>}
          </div>
        </div>
        <span className="text-white/30 text-sm flex-shrink-0 ml-4">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  )
}
