import { useQuery } from '@tanstack/react-query'

// Wikimedia On This Day API
const WIKI_API = 'https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday'

// Get today's date parts
function getTodayParts() {
  const now = new Date()
  return {
    month: (now.getMonth() + 1).toString().padStart(2, '0'),
    day: now.getDate().toString().padStart(2, '0'),
  }
}

// Fetch On This Day events
async function fetchOnThisDay() {
  const { month, day } = getTodayParts()
  
  const response = await fetch(`${WIKI_API}/all/${month}/${day}`, {
    headers: {
      'Accept': 'application/json',
    },
  })
  
  if (!response.ok) throw new Error('Failed to fetch history')
  
  const data = await response.json()
  
  // Combine events, births, deaths and sort by year
  const events = [
    ...(data.events || []).map((e) => ({ ...e, type: 'event' })),
    ...(data.births || []).slice(0, 10).map((e) => ({ ...e, type: 'birth' })),
    ...(data.deaths || []).slice(0, 10).map((e) => ({ ...e, type: 'death' })),
  ]
    .filter((e) => e.pages && e.pages.length > 0)
    .map((event) => {
      const page = event.pages[0]
      return {
        id: `${event.type}-${event.year}-${page.pageid}`,
        year: event.year,
        text: event.text,
        type: event.type,
        title: page.titles?.normalized || page.title,
        description: page.description,
        extract: page.extract,
        thumbnail: page.thumbnail?.source,
        wikiUrl: page.content_urls?.desktop?.page,
      }
    })
    .sort((a, b) => b.year - a.year)

  return events
}

export function useHistoryScraper() {
  return useQuery({
    queryKey: ['on-this-day', getTodayParts()],
    queryFn: fetchOnThisDay,
    staleTime: 1000 * 60 * 60, // 1 hour (data doesn't change within a day)
  })
}
