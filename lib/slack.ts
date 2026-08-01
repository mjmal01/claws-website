import { WebClient } from '@slack/web-api'

let _slack: WebClient | null = null

function getSlack(): WebClient {
  if (!_slack) {
    _slack = new WebClient(process.env.SLACK_BOT_TOKEN)
  }
  return _slack
}

export async function sendWelcomeDM(slackEmail: string, memberName: string): Promise<void> {
  try {
    const slack = getSlack()
    const user = await slack.users.lookupByEmail({ email: slackEmail })
    if (!user.user?.id) return

    await slack.chat.postMessage({
      channel: user.user.id,
      text: `Welcome to CLAWS, ${memberName}! 🚀 We're thrilled to have you on the team. Head to the portal to complete your onboarding checklist and get started.`,
    })
  } catch {
    // Non-fatal — Slack DM failure should not break the auth flow
  }
}

export async function sendCheckinDM(
  slackEmail: string,
  eventTitle: string,
  pointsAwarded: number
): Promise<void> {
  try {
    const slack = getSlack()
    const user = await slack.users.lookupByEmail({ email: slackEmail })
    if (!user.user?.id) return

    await slack.chat.postMessage({
      channel: user.user.id,
      text: `You checked in to *${eventTitle}* 🚀 +${pointsAwarded}pts added to your total.`,
    })
  } catch {
    // Non-fatal
  }
}

export async function sendAtRiskWarningDM(
  slackEmail: string,
  memberName: string,
  currentPoints: number,
  minimumPoints: number
): Promise<void> {
  try {
    const slack = getSlack()
    const user = await slack.users.lookupByEmail({ email: slackEmail })
    if (!user.user?.id) return

    await slack.chat.postMessage({
      channel: user.user.id,
      text: `Hi ${memberName}, you currently have ${currentPoints} points this semester. The minimum to maintain active membership is ${minimumPoints}. Keep attending meetings and completing tasks — you got this!`,
    })
  } catch {
    // Non-fatal
  }
}

export async function sendAbsenceStatusDM(
  slackEmail: string,
  eventTitle: string,
  status: 'approved' | 'denied'
): Promise<void> {
  try {
    const slack = getSlack()
    const user = await slack.users.lookupByEmail({ email: slackEmail })
    if (!user.user?.id) return

    const msg =
      status === 'approved'
        ? `Your absence request for *${eventTitle}* has been approved. This absence will not count against your attendance.`
        : `Your absence request for *${eventTitle}* was not approved. Please reach out to your subteam lead if you have questions.`

    await slack.chat.postMessage({ channel: user.user.id, text: msg })
  } catch {
    // Non-fatal
  }
}

export async function postAnnouncementToChannel(
  channel: string,
  title: string,
  body: string,
  authorName: string
): Promise<void> {
  const slack = getSlack()
  await slack.chat.postMessage({
    channel,
    text: `*${title}*\n${body}\n— ${authorName}`,
  })
}

export async function postAgendaToGeneral(
  eventTitle: string,
  date: string,
  location: string | null,
  agendaItems: string[]
): Promise<void> {
  const slack = getSlack()
  const items = agendaItems.map((item, i) => `${i + 1}. ${item}`).join('\n')
  const loc = location ? `\n📍 ${location}` : ''
  await slack.chat.postMessage({
    channel: '#general',
    text: `📅 *Upcoming: ${eventTitle}*\n${date}${loc}\n\n*Agenda:*\n${items}`,
  })
}

export async function postToSubteamChannel(
  channel: string,
  message: string,
  authorName: string
): Promise<void> {
  const slack = getSlack()
  await slack.chat.postMessage({
    channel,
    text: `${message}\n— ${authorName}`,
  })
}
