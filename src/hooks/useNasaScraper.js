import { useInfiniteQuery } from '@tanstack/react-query'

// NASA APOD API
// Get your own free key at https://api.nasa.gov for higher limits
const NASA_API = 'https://api.nasa.gov/planetary/apod'
const API_KEY = 'DEMO_KEY'

// Get date string in YYYY-MM-DD format
function getDateString(daysAgo = 0) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// Fetch APOD entries
async function fetchApod(pageParam = 0) {
  const batchSize = 3 // Reduced to avoid rate limits
  const startDay = pageParam * batchSize
  
  // Fetch a range of dates
  const endDate = getDateString(startDay)
  const startDate = getDateString(startDay + batchSize - 1)
  
  const params = new URLSearchParams({
    api_key: API_KEY,
    start_date: startDate,
    end_date: endDate,
    thumbs: 'true',
  })

  const response = await fetch(`${NASA_API}?${params}`)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    if (errorData.error?.code === 'OVER_RATE_LIMIT') {
      throw new Error('NASA API rate limit reached. Please try again in a few minutes.')
    }
    throw new Error('Failed to fetch from NASA')
  }
  
  const data = await response.json()
  
  // API returns array, newest first when we reverse
  // Filter out copyrighted images - only keep public domain (NASA) content
  const entries = (Array.isArray(data) ? data : [data])
    .filter((item) => !item.copyright) // Only public domain images
    .reverse()
    .map((item) => ({
      id: item.date,
      title: item.title,
      explanation: item.explanation,
      date: item.date,
      mediaType: item.media_type,
      url: item.url,
      hdUrl: item.hdurl,
      thumbnailUrl: item.thumbnail_url || item.url,
    }))

  return {
    entries,
    nextCursor: pageParam + 1,
    hasMore: entries.length > 0,
  }
}

export function useNasaScraper() {
  return useInfiniteQuery({
    queryKey: ['nasa-apod'],
    queryFn: ({ pageParam }) => fetchApod(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60 * 60, // 1 hour cache to avoid rate limits
    gcTime: 1000 * 60 * 60 * 2, // Keep in cache for 2 hours
    retry: 1, // Only retry once
    retryDelay: 5000, // Wait 5 seconds before retry
  })
}
