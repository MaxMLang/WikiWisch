import { useInfiniteQuery } from '@tanstack/react-query'

// bioRxiv/medRxiv categories
export const BIORXIV_CATEGORIES = [
  { id: 'all', label: 'All Categories', server: 'biorxiv' },
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

export const MEDRXIV_CATEGORIES = [
  { id: 'all', label: 'All Categories', server: 'medrxiv' },
  { id: 'infectious-diseases', label: 'Infectious Diseases', server: 'medrxiv' },
  { id: 'epidemiology', label: 'Epidemiology', server: 'medrxiv' },
  { id: 'public-health', label: 'Public Health', server: 'medrxiv' },
  { id: 'psychiatry', label: 'Psychiatry', server: 'medrxiv' },
  { id: 'cardiovascular-medicine', label: 'Cardiovascular Medicine', server: 'medrxiv' },
  { id: 'oncology', label: 'Oncology', server: 'medrxiv' },
  { id: 'neurology', label: 'Neurology', server: 'medrxiv' },
  { id: 'genetic-and-genomic-medicine', label: 'Genetic & Genomic Medicine', server: 'medrxiv' },
  { id: 'health-informatics', label: 'Health Informatics', server: 'medrxiv' },
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

// Fetch papers from bioRxiv/medRxiv
async function fetchPapers(server, pageParam = 0) {
  const { start, end } = getDateRange()
  const cursor = pageParam * 30
  
  const url = `${API_BASE}/${server}/${start}/${end}/${cursor}`
  const response = await fetch(url)
  
  if (!response.ok) throw new Error(`Failed to fetch from ${server}`)
  
  const data = await response.json()
  
  const papers = (data.collection || []).map((paper) => ({
    id: paper.doi,
    title: paper.title || 'Untitled',
    authors: paper.authors ? paper.authors.split('; ').slice(0, 5) : [],
    abstract: paper.abstract || '',
    category: paper.category || '',
    date: paper.date || '',
    server: paper.server || server,
    doi: paper.doi,
    version: paper.version,
    absLink: `https://www.${server}.org/content/${paper.doi}v${paper.version}`,
    pdfLink: `https://www.${server}.org/content/${paper.doi}v${paper.version}.full.pdf`,
  }))
  
  return {
    papers,
    nextCursor: pageParam + 1,
    hasMore: papers.length === 30,
  }
}

export function useBiorxivScraper(server = 'medrxiv') {
  return useInfiniteQuery({
    queryKey: ['biorxiv-papers', server],
    queryFn: ({ pageParam }) => fetchPapers(server, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
