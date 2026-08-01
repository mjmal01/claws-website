'use client'

import { useState, useTransition } from 'react'
import { updateMemberPhone, updateMemberBio } from '@/app/actions/profile'

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-6 space-y-5">
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  )
}

// ── Field wrapper ──────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-white/60">{label}</label>
      {children}
    </div>
  )
}

// ── Checkbox row ───────────────────────────────────────────────────────────
function CheckboxRow({
  label,
  description,
  defaultChecked,
}: {
  label: string
  description?: string
  defaultChecked?: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false)
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="sr-only"
        />
        <div
          className={[
            'w-4 h-4 rounded border transition-colors',
            checked
              ? 'bg-[#FFCB05] border-[#FFCB05]'
              : 'bg-transparent border-white/20 group-hover:border-white/40',
          ].join(' ')}
        >
          {checked && (
            <svg className="w-4 h-4 text-space" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      <div>
        <span className="text-sm text-white/80">{label}</span>
        {description && <p className="text-xs text-white/35 mt-0.5">{description}</p>}
      </div>
    </label>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [phoneSaved, setPhoneSaved] = useState(false)
  const [bioSaved, setBioSaved] = useState(false)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [bioError, setBioError] = useState<string | null>(null)
  const [phonePending, startPhoneTransition] = useTransition()
  const [bioPending, startBioTransition] = useTransition()

  function handlePhoneSave() {
    setPhoneError(null)
    setPhoneSaved(false)
    startPhoneTransition(async () => {
      try {
        await updateMemberPhone(phone)
        setPhoneSaved(true)
        setTimeout(() => setPhoneSaved(false), 2500)
      } catch {
        setPhoneError('Failed to save phone number.')
      }
    })
  }

  function handleBioSave() {
    setBioError(null)
    setBioSaved(false)
    startBioTransition(async () => {
      try {
        await updateMemberBio(bio)
        setBioSaved(true)
        setTimeout(() => setBioSaved(false), 2500)
      } catch {
        setBioError('Failed to save bio.')
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-1">Manage your profile, notifications, and integrations.</p>
      </div>

      {/* PROFILE */}
      <Section title="Profile">
        <Field label="Name">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10">
            <span className="text-sm text-white/40 italic flex-1">Contact leadership to change your name</span>
          </div>
        </Field>

        <Field label="Email">
          <div className="px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10">
            <span className="text-sm text-white/40">Managed by your @umich.edu account</span>
          </div>
        </Field>

        <Field label="Phone Number">
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(xxx) xxx-xxxx"
              className="flex-1 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-nebula/50 transition-colors"
            />
            <button
              onClick={handlePhoneSave}
              disabled={phonePending}
              className="px-4 py-2.5 rounded-lg bg-[#FFCB05] text-space text-sm font-semibold hover:bg-[#FFD740] transition-colors disabled:opacity-50"
            >
              {phonePending ? 'Saving…' : phoneSaved ? 'Saved ✓' : 'Save'}
            </button>
          </div>
          {phoneError && <p className="text-xs text-red-400 mt-1">{phoneError}</p>}
        </Field>

        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the team a bit about yourself..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-nebula/50 transition-colors resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            {bioError && <p className="text-xs text-red-400">{bioError}</p>}
            <span />
            <button
              onClick={handleBioSave}
              disabled={bioPending}
              className="px-4 py-2 rounded-lg bg-[#FFCB05] text-space text-sm font-semibold hover:bg-[#FFD740] transition-colors disabled:opacity-50"
            >
              {bioPending ? 'Saving…' : bioSaved ? 'Saved ✓' : 'Save Bio'}
            </button>
          </div>
        </Field>

        <Field label="Avatar">
          <div className="px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10">
            <span className="text-sm text-white/40">Synced from Google — update in your Google account</span>
          </div>
        </Field>
      </Section>

      {/* NOTIFICATIONS */}
      <Section title="Notifications">
        <div className="space-y-4">
          <CheckboxRow
            label="Task due reminders"
            description="Get notified 24 hours before a task is due"
            defaultChecked
          />
          <CheckboxRow
            label="New announcements"
            description="Portal and Slack #announcements posts"
            defaultChecked
          />
          <CheckboxRow
            label="Badge unlocks"
            description="Celebrate when you earn a new badge"
            defaultChecked
          />
          <CheckboxRow
            label="Slack activity in portal"
            description="Mirror Slack messages in the portal News feed"
          />
          <CheckboxRow
            label="Event reminders"
            description="24-hour reminder before meetings and events"
            defaultChecked
          />
          <CheckboxRow
            label="Absence status updates"
            description="When your absence request is approved or denied"
            defaultChecked
          />
        </div>
      </Section>

      {/* INTEGRATIONS */}
      <Section title="Integrations">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <p className="text-sm font-semibold text-white">Google Calendar</p>
              <p className="text-xs text-white/40 mt-0.5">Sync all CLAWS events to your calendar</p>
            </div>
            <a
              href="#"
              className="px-4 py-2 rounded-lg bg-[#FFCB05] text-space text-sm font-semibold hover:bg-[#FFD740] transition-colors"
            >
              Connect →
            </a>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <p className="text-sm font-semibold text-white">Slack</p>
              <p className="text-xs text-white/40 mt-0.5">@umich workspace</p>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              Connected ✓
            </span>
          </div>
        </div>
      </Section>
    </div>
  )
}
