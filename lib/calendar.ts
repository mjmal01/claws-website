import { google } from 'googleapis'

export function getOAuth2Client(accessToken: string, refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/calendar/callback`
  )
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  return oauth2Client
}

export interface CalendarEvent {
  id: string
  title: string
  description: string | null
  location: string | null
  startTime: string
  endTime: string
}

export async function addEventToCalendar(
  accessToken: string,
  refreshToken: string,
  event: CalendarEvent
): Promise<string | null> {
  try {
    const auth = getOAuth2Client(accessToken, refreshToken)
    const calendar = google.calendar({ version: 'v3', auth })

    const start = new Date(event.startTime)
    const end = new Date(event.endTime)

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.title,
        description: event.description ?? undefined,
        location: event.location ?? undefined,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      },
    })

    return response.data.id ?? null
  } catch {
    return null
  }
}

export async function removeEventFromCalendar(
  accessToken: string,
  refreshToken: string,
  calendarEventId: string
): Promise<void> {
  try {
    const auth = getOAuth2Client(accessToken, refreshToken)
    const calendar = google.calendar({ version: 'v3', auth })
    await calendar.events.delete({ calendarId: 'primary', eventId: calendarEventId })
  } catch {
    // Non-fatal
  }
}
