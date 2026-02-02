import { useInfiniteQuery } from '@tanstack/react-query'

const ART_API = 'https://api.artic.edu/api/v1/artworks'

// Fetch artworks from Art Institute of Chicago
async function fetchArtworks(pageParam = 1) {
  // Use the simpler endpoint with query params
  const url = `${ART_API}?page=${pageParam}&limit=5&fields=id,title,artist_display,date_display,medium_display,department_title,image_id`

  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch artworks')
  
  const data = await response.json()
  
  // Get the IIIF image base URL from config
  const iiifUrl = data.config?.iiif_url || 'https://www.artic.edu/iiif/2'
  
  const artworks = data.data
    .filter((item) => item.image_id) // Only items with images
    .map((item) => ({
      id: item.id,
      title: item.title || 'Untitled',
      artist: item.artist_display || 'Unknown artist',
      date: item.date_display || '',
      medium: item.medium_display || '',
      department: item.department_title || '',
      imageUrl: `${iiifUrl}/${item.image_id}/full/843,/0/default.jpg`,
      thumbnailUrl: `${iiifUrl}/${item.image_id}/full/400,/0/default.jpg`,
      detailUrl: `https://www.artic.edu/artworks/${item.id}`,
    }))

  return {
    artworks,
    nextCursor: data.pagination?.current_page < data.pagination?.total_pages 
      ? pageParam + 1 
      : undefined,
  }
}

export function useArtScraper() {
  return useInfiniteQuery({
    queryKey: ['art-chicago'],
    queryFn: ({ pageParam }) => fetchArtworks(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 10,
  })
}
