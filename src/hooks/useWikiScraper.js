import { useInfiniteQuery } from '@tanstack/react-query'

const WIKI_API_BASE = 'https://en.wikipedia.org/api/rest_v1'
const WIKI_ACTION_API = 'https://en.wikipedia.org/w/api.php'

// Category mappings to Wikipedia category names
const CATEGORY_SEEDS = {
  science: [
    'Physics', 'Chemistry', 'Biology', 'Astronomy', 'Mathematics',
    'Genetics', 'Neuroscience', 'Ecology', 'Quantum_mechanics'
  ],
  history: [
    'Ancient_history', 'Medieval_history', 'World_War_II', 'Roman_Empire',
    'Renaissance', 'Industrial_Revolution', 'Ancient_Egypt', 'Viking_Age'
  ],
  technology: [
    'Computer_science', 'Artificial_intelligence', 'Internet',
    'Robotics', 'Space_exploration', 'Nuclear_technology', 'Biotechnology'
  ],
  arts: [
    'Renaissance_art', 'Impressionism', 'Classical_music', 'Jazz',
    'Film_history', 'Literature', 'Architecture', 'Photography'
  ],
  geography: [
    'Mountain', 'Ocean', 'Desert', 'River', 'Island', 'Volcano',
    'Rainforest', 'National_park'
  ],
  nature: [
    'Endangered_species', 'Marine_biology', 'Paleontology', 'Botany',
    'Ornithology', 'Climate', 'Geology', 'Evolution'
  ],
  philosophy: [
    'Ethics', 'Existentialism', 'Logic', 'Metaphysics', 
    'Philosophy_of_mind', 'Stoicism', 'Eastern_philosophy'
  ],
  sports: [
    'Olympic_Games', 'Football', 'Tennis', 'Basketball',
    'Cricket', 'Athletics_(sport)', 'Swimming_(sport)'
  ],
}

// Fetch a random article summary
async function fetchRandomSummary() {
  const response = await fetch(`${WIKI_API_BASE}/page/random/summary`)
  if (!response.ok) throw new Error('Failed to fetch random article')
  return response.json()
}

// Fetch article summary by title
async function fetchSummary(title) {
  const encodedTitle = encodeURIComponent(title.replace(/ /g, '_'))
  const response = await fetch(`${WIKI_API_BASE}/page/summary/${encodedTitle}`)
  if (!response.ok) return null
  return response.json()
}

// Get related articles for a seed topic
async function fetchRelatedTitles(seedTitle) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    list: 'search',
    srsearch: seedTitle,
    srlimit: '20',
    srwhat: 'text',
  })
  
  const response = await fetch(`${WIKI_ACTION_API}?${params}`)
  if (!response.ok) throw new Error('Failed to fetch related articles')
  const data = await response.json()
  return data.query?.search?.map((item) => item.title) || []
}

// Shuffle array using Fisher-Yates
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Main fetch function that gets a batch of articles
async function fetchArticleBatch(categories, pageParam = 0) {
  const batchSize = 5
  const articles = []
  const seenTitles = new Set()
  
  // If no categories selected, use pure random
  if (!categories || categories.length === 0) {
    const promises = Array(batchSize).fill(null).map(() => fetchRandomSummary())
    const results = await Promise.allSettled(promises)
    
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        const article = result.value
        if (!seenTitles.has(article.title) && article.type === 'standard') {
          seenTitles.add(article.title)
          articles.push(article)
        }
      }
    }
    
    return { articles, nextCursor: pageParam + 1 }
  }
  
  // Category-based fetching
  const selectedSeeds = categories.flatMap((cat) => CATEGORY_SEEDS[cat] || [])
  const shuffledSeeds = shuffleArray(selectedSeeds)
  
  // Pick random seed topics and fetch related articles
  const seedsToUse = shuffledSeeds.slice(0, 3)
  const allTitles = []
  
  for (const seed of seedsToUse) {
    try {
      const titles = await fetchRelatedTitles(seed)
      allTitles.push(...titles)
    } catch (e) {
      console.warn(`Failed to fetch titles for seed: ${seed}`, e)
    }
  }
  
  // Shuffle and pick unique titles
  const shuffledTitles = shuffleArray(allTitles)
  const uniqueTitles = [...new Set(shuffledTitles)].slice(0, batchSize * 2)
  
  // Fetch summaries in parallel
  const summaryPromises = uniqueTitles.map((title) => fetchSummary(title))
  const summaries = await Promise.allSettled(summaryPromises)
  
  for (const result of summaries) {
    if (articles.length >= batchSize) break
    
    if (result.status === 'fulfilled' && result.value) {
      const article = result.value
      // Filter out disambiguation pages, lists, and articles without good content
      if (
        article.type === 'standard' &&
        !seenTitles.has(article.title) &&
        article.extract &&
        article.extract.length > 100
      ) {
        seenTitles.add(article.title)
        articles.push(article)
      }
    }
  }
  
  // If we didn't get enough, fill with random
  while (articles.length < batchSize) {
    try {
      const random = await fetchRandomSummary()
      if (random.type === 'standard' && !seenTitles.has(random.title)) {
        seenTitles.add(random.title)
        articles.push(random)
      }
    } catch (e) {
      break
    }
  }
  
  return { articles, nextCursor: pageParam + 1 }
}

export function useWikiScraper(categories) {
  return useInfiniteQuery({
    queryKey: ['wiki-articles', categories],
    queryFn: ({ pageParam }) => fetchArticleBatch(categories, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: Infinity, // Don't refetch automatically
  })
}

export { fetchSummary }
