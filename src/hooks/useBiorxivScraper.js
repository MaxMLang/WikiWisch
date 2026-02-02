import { useInfiniteQuery } from '@tanstack/react-query'

// Combined categories for both bioRxiv and medRxiv
export const PREPRINT_CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  // medRxiv categories
  { id: 'infectious-diseases', label: 'Infectious Diseases', server: 'medrxiv' },
  { id: 'epidemiology', label: 'Epidemiology', server: 'medrxiv' },
  { id: 'public-health', label: 'Public Health', server: 'medrxiv' },
  { id: 'psychiatry', label: 'Psychiatry', server: 'medrxiv' },
  { id: 'cardiovascular-medicine', label: 'Cardiovascular Medicine', server: 'medrxiv' },
  { id: 'oncology', label: 'Oncology', server: 'medrxiv' },
  { id: 'neurology', label: 'Neurology', server: 'medrxiv' },
  // bioRxiv categories
  { id: 'neuroscience', label: 'Neuroscience', server: 'biorxiv' },
  { id: 'genetics', label: 'Genetics', server: 'biorxiv' },
  { id: 'genomics', label: 'Genomics', server: 'biorxiv' },
  { id: 'bioinformatics', label: 'Bioinformatics', server: 'biorxiv' },
  { id: 'cell-biology', label: 'Cell Biology', server: 'biorxiv' },
  { id: 'molecular-biology', label: 'Molecular Biology', server: 'biorxiv' },
  { id: 'immunology', label: 'Immunology', server: 'biorxiv' },
  { id: 'microbiology', label: 'Microbiology', server: 'biorxiv' },
  { id: 'cancer-biology', label: 'Cancer Biology', server: 'biorxiv' },
  { id: 'evolutionary-biology', label: 'Evolutionary Biology', server: 'biorxiv' },
]

const API_BASE = 'https://api.biorxiv.org/details'

// Get date range for fetching (last 30 days)
function getDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  
  const format = (d) => d.toISOString().split('T')[0]
  return { start: format(start), end: format(end) }
}

// Fetch papers from a single server
async function fetchFromServer(server, start, end, cursor) {
  const url = `${API_BASE}/${server}/${start}/${end}/${cursor}`
  const response = await fetch(url)
  
  if (!response.ok) return []
  
  const data = await response.json()
  return (data.collection || []).map((paper) => ({
    id: paper.doi,
    title: paper.title || 'Untitled',
    authors: paper.authors ? paper.authors.split('; ').slice(0, 5) : [],
    abstract: paper.abstract || '',
    category: paper.category || '',
    date: paper.date || '',
    server: server,
    doi: paper.doi,
    version: paper.version,
    absLink: `https://www.${server}.org/content/${paper.doi}v${paper.version}`,
    pdfLink: `https://www.${server}.org/content/${paper.doi}v${paper.version}.full.pdf`,
  }))
}

// Fetch papers from both servers
async function fetchPapers(category, pageParam = 0) {
  const { start, end } = getDateRange()
  const cursor = pageParam * 50
  
  // If category is 'all', fetch from both servers
  // Otherwise, check which server the category belongs to
  const categoryInfo = PREPRINT_CATEGORIES.find(c => c.id === category)
  
  let papers = []
  
  if (category === 'all' || !categoryInfo?.server) {
    // Fetch from both servers in parallel
    const [medrxivPapers, biorxivPapers] = await Promise.all([
      fetchFromServer('medrxiv', start, end, cursor),
      fetchFromServer('biorxiv', start, end, cursor),
    ])
    papers = [...medrxivPapers, ...biorxivPapers]
  } else {
    // Fetch from specific server
    papers = await fetchFromServer(categoryInfo.server, start, end, cursor)
  }
  
  // Filter by category if not 'all'
  if (category && category !== 'all') {
    papers = papers.filter((p) => 
      p.category.toLowerCase().includes(category.toLowerCase().replace(/-/g, ' '))
    )
  }
  
  // Sort by date (newest first) and take first 20
  papers = papers
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20)
  
  return {
    papers,
    nextCursor: pageParam + 1,
    hasMore: papers.length > 0,
  }
}

export function useBiorxivScraper(category = 'all') {
  return useInfiniteQuery({
    queryKey: ['preprint-papers', category],
    queryFn: ({ pageParam }) => fetchPapers(category, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
