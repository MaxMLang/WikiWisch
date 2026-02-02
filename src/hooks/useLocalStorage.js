import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wikiwisch_data'

const defaultState = {
  theme: 'system',
  categories: ['science', 'history', 'technology', 'arts', 'geography'],
  arxivCategory: 'cs.AI',
  medrxivCategory: 'all',
  biorxivCategory: 'all',
  tabOrder: ['wiki', 'arxiv', 'medrxiv', 'biorxiv', 'art', 'nasa', 'history'],
  enabledTabs: ['wiki', 'arxiv', 'medrxiv', 'art', 'nasa', 'history'], // biorxiv not enabled by default
  bookmarks: [],
  arxivBookmarks: [],
  biorxivBookmarks: [], // covers both medrxiv and biorxiv
  artBookmarks: [],
  nasaBookmarks: [],
  historyBookmarks: [],
}

export function useLocalStorage() {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // Migration: ensure new tabs are in tabOrder and enabledTabs
        let tabOrder = parsed.tabOrder || defaultState.tabOrder
        let enabledTabs = parsed.enabledTabs || defaultState.enabledTabs
        
        // Add medrxiv and biorxiv if missing from tabOrder
        if (!tabOrder.includes('medrxiv')) {
          const arxivIndex = tabOrder.indexOf('arxiv')
          tabOrder = [...tabOrder.slice(0, arxivIndex + 1), 'medrxiv', 'biorxiv', ...tabOrder.slice(arxivIndex + 1)]
        }
        
        // Add medrxiv to enabledTabs if missing (biorxiv stays disabled by default)
        if (!enabledTabs.includes('medrxiv') && !enabledTabs.includes('biorxiv')) {
          enabledTabs = [...enabledTabs, 'medrxiv']
        }
        
        return { ...defaultState, ...parsed, tabOrder, enabledTabs }
      }
    } catch (e) {
      console.error('Failed to parse localStorage:', e)
    }
    return defaultState
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [state])

  const setTheme = useCallback((theme) => {
    setState((prev) => ({ ...prev, theme }))
  }, [])

  const toggleCategory = useCallback((category) => {
    setState((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories }
    })
  }, [])

  const setCategories = useCallback((categories) => {
    setState((prev) => ({ ...prev, categories }))
  }, [])

  const setTabOrder = useCallback((tabOrder) => {
    setState((prev) => ({ ...prev, tabOrder }))
  }, [])

  const setArxivCategory = useCallback((arxivCategory) => {
    setState((prev) => ({ ...prev, arxivCategory }))
  }, [])

  const setMedrxivCategory = useCallback((medrxivCategory) => {
    setState((prev) => ({ ...prev, medrxivCategory }))
  }, [])

  const setBiorxivCategory = useCallback((biorxivCategory) => {
    setState((prev) => ({ ...prev, biorxivCategory }))
  }, [])

  // Toggle tab enabled/disabled (at least one must remain enabled)
  const toggleTab = useCallback((tabId) => {
    setState((prev) => {
      const enabledTabs = prev.enabledTabs || defaultState.enabledTabs
      const isEnabled = enabledTabs.includes(tabId)
      
      // Don't disable if it's the last enabled tab
      if (isEnabled && enabledTabs.length <= 1) {
        return prev
      }
      
      const newEnabledTabs = isEnabled
        ? enabledTabs.filter((t) => t !== tabId)
        : [...enabledTabs, tabId]
      
      return { ...prev, enabledTabs: newEnabledTabs }
    })
  }, [])

  // Wikipedia bookmarks
  const addBookmark = useCallback((article) => {
    setState((prev) => {
      if (prev.bookmarks.some((b) => b.pageid === article.pageid)) return prev
      return {
        ...prev,
        bookmarks: [
          { pageid: article.pageid, title: article.title, thumbnail: article.thumbnail?.source, savedAt: Date.now() },
          ...prev.bookmarks,
        ],
      }
    })
  }, [])

  const removeBookmark = useCallback((pageid) => {
    setState((prev) => ({ ...prev, bookmarks: prev.bookmarks.filter((b) => b.pageid !== pageid) }))
  }, [])

  const isBookmarked = useCallback((pageid) => state.bookmarks.some((b) => b.pageid === pageid), [state.bookmarks])
  const clearAllBookmarks = useCallback(() => setState((prev) => ({ ...prev, bookmarks: [] })), [])

  // arXiv bookmarks
  const addArxivBookmark = useCallback((paper) => {
    setState((prev) => {
      if (prev.arxivBookmarks.some((b) => b.id === paper.id)) return prev
      return {
        ...prev,
        arxivBookmarks: [
          { id: paper.id, title: paper.title, authors: paper.authors?.slice(0, 3), absLink: paper.absLink, savedAt: Date.now() },
          ...prev.arxivBookmarks,
        ],
      }
    })
  }, [])

  const removeArxivBookmark = useCallback((id) => {
    setState((prev) => ({ ...prev, arxivBookmarks: prev.arxivBookmarks.filter((b) => b.id !== id) }))
  }, [])

  const isArxivBookmarked = useCallback((id) => state.arxivBookmarks.some((b) => b.id === id), [state.arxivBookmarks])
  const clearAllArxivBookmarks = useCallback(() => setState((prev) => ({ ...prev, arxivBookmarks: [] })), [])

  // bioRxiv/medRxiv bookmarks
  const addBiorxivBookmark = useCallback((paper) => {
    setState((prev) => {
      const biorxivBookmarks = prev.biorxivBookmarks || []
      if (biorxivBookmarks.some((b) => b.id === paper.id)) return prev
      return {
        ...prev,
        biorxivBookmarks: [
          { id: paper.id, title: paper.title, authors: paper.authors?.slice(0, 3), server: paper.server, absLink: paper.absLink, savedAt: Date.now() },
          ...biorxivBookmarks,
        ],
      }
    })
  }, [])

  const removeBiorxivBookmark = useCallback((id) => {
    setState((prev) => ({ ...prev, biorxivBookmarks: (prev.biorxivBookmarks || []).filter((b) => b.id !== id) }))
  }, [])

  const isBiorxivBookmarked = useCallback((id) => (state.biorxivBookmarks || []).some((b) => b.id === id), [state.biorxivBookmarks])
  const clearAllBiorxivBookmarks = useCallback(() => setState((prev) => ({ ...prev, biorxivBookmarks: [] })), [])

  // Art bookmarks
  const addArtBookmark = useCallback((artwork) => {
    setState((prev) => {
      if (prev.artBookmarks.some((b) => b.id === artwork.id)) return prev
      return {
        ...prev,
        artBookmarks: [
          { id: artwork.id, title: artwork.title, artist: artwork.artist, thumbnailUrl: artwork.thumbnailUrl, detailUrl: artwork.detailUrl, savedAt: Date.now() },
          ...prev.artBookmarks,
        ],
      }
    })
  }, [])

  const removeArtBookmark = useCallback((id) => {
    setState((prev) => ({ ...prev, artBookmarks: prev.artBookmarks.filter((b) => b.id !== id) }))
  }, [])

  const isArtBookmarked = useCallback((id) => state.artBookmarks.some((b) => b.id === id), [state.artBookmarks])
  const clearAllArtBookmarks = useCallback(() => setState((prev) => ({ ...prev, artBookmarks: [] })), [])

  // NASA bookmarks
  const addNasaBookmark = useCallback((entry) => {
    setState((prev) => {
      if (prev.nasaBookmarks.some((b) => b.id === entry.id)) return prev
      return {
        ...prev,
        nasaBookmarks: [
          { id: entry.id, title: entry.title, date: entry.date, url: entry.url, hdUrl: entry.hdUrl, savedAt: Date.now() },
          ...prev.nasaBookmarks,
        ],
      }
    })
  }, [])

  const removeNasaBookmark = useCallback((id) => {
    setState((prev) => ({ ...prev, nasaBookmarks: prev.nasaBookmarks.filter((b) => b.id !== id) }))
  }, [])

  const isNasaBookmarked = useCallback((id) => state.nasaBookmarks.some((b) => b.id === id), [state.nasaBookmarks])
  const clearAllNasaBookmarks = useCallback(() => setState((prev) => ({ ...prev, nasaBookmarks: [] })), [])

  // History bookmarks
  const addHistoryBookmark = useCallback((event) => {
    setState((prev) => {
      if (prev.historyBookmarks.some((b) => b.id === event.id)) return prev
      return {
        ...prev,
        historyBookmarks: [
          { id: event.id, title: event.title, year: event.year, type: event.type, text: event.text, wikiUrl: event.wikiUrl, savedAt: Date.now() },
          ...prev.historyBookmarks,
        ],
      }
    })
  }, [])

  const removeHistoryBookmark = useCallback((id) => {
    setState((prev) => ({ ...prev, historyBookmarks: prev.historyBookmarks.filter((b) => b.id !== id) }))
  }, [])

  const isHistoryBookmarked = useCallback((id) => state.historyBookmarks.some((b) => b.id === id), [state.historyBookmarks])
  const clearAllHistoryBookmarks = useCallback(() => setState((prev) => ({ ...prev, historyBookmarks: [] })), [])

  return {
    theme: state.theme,
    categories: state.categories,
    arxivCategory: state.arxivCategory || defaultState.arxivCategory,
    medrxivCategory: state.medrxivCategory || defaultState.medrxivCategory,
    biorxivCategory: state.biorxivCategory || defaultState.biorxivCategory,
    tabOrder: state.tabOrder || defaultState.tabOrder,
    enabledTabs: state.enabledTabs || defaultState.enabledTabs,
    bookmarks: state.bookmarks,
    arxivBookmarks: state.arxivBookmarks,
    biorxivBookmarks: state.biorxivBookmarks || [],
    artBookmarks: state.artBookmarks,
    nasaBookmarks: state.nasaBookmarks,
    historyBookmarks: state.historyBookmarks,
    setTheme,
    toggleCategory,
    setCategories,
    setArxivCategory,
    setMedrxivCategory,
    setBiorxivCategory,
    setTabOrder,
    toggleTab,
    // Wikipedia
    addBookmark, removeBookmark, isBookmarked, clearAllBookmarks,
    // arXiv
    addArxivBookmark, removeArxivBookmark, isArxivBookmarked, clearAllArxivBookmarks,
    // bioRxiv/medRxiv
    addBiorxivBookmark, removeBiorxivBookmark, isBiorxivBookmarked, clearAllBiorxivBookmarks,
    // Art
    addArtBookmark, removeArtBookmark, isArtBookmarked, clearAllArtBookmarks,
    // NASA
    addNasaBookmark, removeNasaBookmark, isNasaBookmarked, clearAllNasaBookmarks,
    // History
    addHistoryBookmark, removeHistoryBookmark, isHistoryBookmarked, clearAllHistoryBookmarks,
  }
}
