import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wikiwisch_data'

const defaultState = {
  theme: 'system',
  categories: ['science', 'history', 'technology', 'arts', 'geography'],
  tabOrder: ['wiki', 'arxiv', 'art', 'nasa', 'history'],
  bookmarks: [],
  arxivBookmarks: [],
  artBookmarks: [],
  nasaBookmarks: [],
  historyBookmarks: [],
}

export function useLocalStorage() {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return { ...defaultState, ...JSON.parse(stored) }
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
    tabOrder: state.tabOrder || defaultState.tabOrder,
    bookmarks: state.bookmarks,
    arxivBookmarks: state.arxivBookmarks,
    artBookmarks: state.artBookmarks,
    nasaBookmarks: state.nasaBookmarks,
    historyBookmarks: state.historyBookmarks,
    setTheme,
    toggleCategory,
    setCategories,
    setTabOrder,
    // Wikipedia
    addBookmark, removeBookmark, isBookmarked, clearAllBookmarks,
    // arXiv
    addArxivBookmark, removeArxivBookmark, isArxivBookmarked, clearAllArxivBookmarks,
    // Art
    addArtBookmark, removeArtBookmark, isArtBookmarked, clearAllArtBookmarks,
    // NASA
    addNasaBookmark, removeNasaBookmark, isNasaBookmarked, clearAllNasaBookmarks,
    // History
    addHistoryBookmark, removeHistoryBookmark, isHistoryBookmarked, clearAllHistoryBookmarks,
  }
}
