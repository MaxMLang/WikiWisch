import { useQuery } from '@tanstack/react-query'

// Wikipedia REST API - On This Day endpoint (works with CORS)
const WIKI_API = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday'

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
  
  // Fetch all types: events, births, deaths
  const response = await fetch(`${WIKI_API}/all/${month}/${day}`, {
    headers: {
      'Accept': 'application/json',
    },
  })
  
  if (!response.ok) throw new Error('Failed to fetch history')
  
  const data = await response.json()
  
  // Combine events, births, deaths
  const allEvents = []
  
  // Selected events (curated, most interesting)
  if (data.selected) {
    data.selected.forEach((e) => {
      if (e.pages && e.pages.length > 0) {
        const page = e.pages[0]
        allEvents.push({
          id: `selected-${e.year}-${page.pageid || Math.random()}`,
          year: e.year,
          text: e.text,
          type: 'event',
          title: page.titles?.normalized || page.title,
          description: page.description,
          thumbnail: page.thumbnail?.source,
          wikiUrl: page.content_urls?.desktop?.page,
        })
      }
    })
  }
  
  // Events
  if (data.events) {
    data.events.slice(0, 15).forEach((e) => {
      if (e.pages && e.pages.length > 0) {
        const page = e.pages[0]
        allEvents.push({
          id: `event-${e.year}-${page.pageid || Math.random()}`,
          year: e.year,
          text: e.text,
          type: 'event',
          title: page.titles?.normalized || page.title,
          description: page.description,
          thumbnail: page.thumbnail?.source,
          wikiUrl: page.content_urls?.desktop?.page,
        })
      }
    })
  }
  
  // Births
  if (data.births) {
    data.births.slice(0, 10).forEach((e) => {
      if (e.pages && e.pages.length > 0) {
        const page = e.pages[0]
        allEvents.push({
          id: `birth-${e.year}-${page.pageid || Math.random()}`,
          year: e.year,
          text: e.text,
          type: 'birth',
          title: page.titles?.normalized || page.title,
          description: page.description,
          thumbnail: page.thumbnail?.source,
          wikiUrl: page.content_urls?.desktop?.page,
        })
      }
    })
  }
  
  // Deaths
  if (data.deaths) {
    data.deaths.slice(0, 10).forEach((e) => {
      if (e.pages && e.pages.length > 0) {
        const page = e.pages[0]
        allEvents.push({
          id: `death-${e.year}-${page.pageid || Math.random()}`,
          year: e.year,
          text: e.text,
          type: 'death',
          title: page.titles?.normalized || page.title,
          description: page.description,
          thumbnail: page.thumbnail?.source,
          wikiUrl: page.content_urls?.desktop?.page,
        })
      }
    })
  }
  
  // Sort by year descending
  return allEvents.sort((a, b) => b.year - a.year)
}

export function useHistoryScraper() {
  return useQuery({
    queryKey: ['on-this-day', getTodayParts()],
    queryFn: fetchOnThisDay,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
