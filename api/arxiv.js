export default async function handler(req, res) {
  const { search_query, start = '0', max_results = '5' } = req.query

  if (!search_query) {
    return res.status(400).json({ error: 'search_query is required' })
  }

  const params = new URLSearchParams({
    search_query,
    start,
    max_results,
    sortBy: 'submittedDate',
    sortOrder: 'descending',
  })

  try {
    const response = await fetch(`https://export.arxiv.org/api/query?${params}`)
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'arXiv API error' })
    }

    const xmlText = await response.text()
    
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).send(xmlText)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch from arXiv' })
  }
}
