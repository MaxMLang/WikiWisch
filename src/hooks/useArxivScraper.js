import { useInfiniteQuery } from '@tanstack/react-query'

// arXiv subject categories
export const ARXIV_CATEGORIES = [
  { id: 'cs.AI', label: 'Artificial Intelligence', group: 'Computer Science' },
  { id: 'cs.LG', label: 'Machine Learning', group: 'Computer Science' },
  { id: 'cs.CV', label: 'Computer Vision', group: 'Computer Science' },
  { id: 'cs.CL', label: 'Computation & Language (NLP)', group: 'Computer Science' },
  { id: 'cs.CR', label: 'Cryptography & Security', group: 'Computer Science' },
  { id: 'cs.RO', label: 'Robotics', group: 'Computer Science' },
  { id: 'stat.ML', label: 'Machine Learning (Stats)', group: 'Statistics' },
  { id: 'math.ST', label: 'Statistics Theory', group: 'Mathematics' },
  { id: 'math.PR', label: 'Probability', group: 'Mathematics' },
  { id: 'physics.pop-ph', label: 'Popular Physics', group: 'Physics' },
  { id: 'astro-ph', label: 'Astrophysics', group: 'Physics' },
  { id: 'quant-ph', label: 'Quantum Physics', group: 'Physics' },
  { id: 'q-bio.NC', label: 'Neurons & Cognition', group: 'Biology' },
  { id: 'q-bio.GN', label: 'Genomics', group: 'Biology' },
  { id: 'econ.GN', label: 'General Economics', group: 'Economics' },
  { id: 'eess.SP', label: 'Signal Processing', group: 'Engineering' },
]

// Use our own API route to avoid CORS issues
const ARXIV_API = '/api/arxiv'

// Parse arXiv Atom XML response
function parseArxivResponse(xmlText) {
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlText, 'text/xml')
  const entries = xml.querySelectorAll('entry')
  
  return Array.from(entries).map((entry) => {
    const id = entry.querySelector('id')?.textContent || ''
    const arxivId = id.split('/abs/').pop() || id.split('/').pop()
    
    // Get all authors
    const authorElements = entry.querySelectorAll('author name')
    const authors = Array.from(authorElements).map((a) => a.textContent)
    
    // Get categories
    const categoryElements = entry.querySelectorAll('category')
    const categories = Array.from(categoryElements).map((c) => c.getAttribute('term'))
    
    // Get links
    const links = entry.querySelectorAll('link')
    let pdfLink = ''
    let absLink = ''
    links.forEach((link) => {
      if (link.getAttribute('title') === 'pdf') {
        pdfLink = link.getAttribute('href')
      }
      if (link.getAttribute('type') === 'text/html') {
        absLink = link.getAttribute('href')
      }
    })
    
    return {
      id: arxivId,
      title: entry.querySelector('title')?.textContent?.replace(/\s+/g, ' ').trim() || '',
      abstract: entry.querySelector('summary')?.textContent?.replace(/\s+/g, ' ').trim() || '',
      authors,
      categories,
      published: entry.querySelector('published')?.textContent || '',
      updated: entry.querySelector('updated')?.textContent || '',
      pdfLink: pdfLink || `https://arxiv.org/pdf/${arxivId}`,
      absLink: absLink || `https://arxiv.org/abs/${arxivId}`,
    }
  })
}

// Fetch papers from arXiv
async function fetchArxivPapers(categories, pageParam = 0) {
  const batchSize = 5
  const start = pageParam * batchSize
  
  // Build search query
  let searchQuery = ''
  if (categories && categories.length > 0) {
    searchQuery = categories.map((cat) => `cat:${cat}`).join('+OR+')
  } else {
    // Default to some popular categories
    searchQuery = 'cat:cs.AI+OR+cat:cs.LG+OR+cat:physics.pop-ph'
  }
  
  const params = new URLSearchParams({
    search_query: searchQuery,
    start: start.toString(),
    max_results: batchSize.toString(),
  })
  
  const response = await fetch(`${ARXIV_API}?${params}`)
  if (!response.ok) throw new Error('Failed to fetch from arXiv')
  
  const xmlText = await response.text()
  const papers = parseArxivResponse(xmlText)
  
  return {
    papers,
    nextCursor: pageParam + 1,
    hasMore: papers.length === batchSize,
  }
}

export function useArxivScraper(categories) {
  return useInfiniteQuery({
    queryKey: ['arxiv-papers', categories],
    queryFn: ({ pageParam }) => fetchArxivPapers(categories, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
