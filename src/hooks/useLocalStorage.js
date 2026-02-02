import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wikiwisch_data'

const defaultState = {
  theme: 'system',
  categories: ['science', 'history', 'technology', 'arts', 'geography'],
  bookmarks: [],
  arxivBookmarks: [],
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

  // Persist to localStorage whenever state changes
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

  const addBookmark = useCallback((article) => {
    setState((prev) => {
      if (prev.bookmarks.some((b) => b.pageid === article.pageid)) {
        return prev
      }
      return {
        ...prev,
        bookmarks: [
          {
            pageid: article.pageid,
            title: article.title,
            thumbnail: article.thumbnail?.source,
            savedAt: Date.now(),
          },
          ...prev.bookmarks,
        ],
      }
    })
  }, [])

  const removeBookmark = useCallback((pageid) => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.pageid !== pageid),
    }))
  }, [])

  const isBookmarked = useCallback(
    (pageid) => state.bookmarks.some((b) => b.pageid === pageid),
    [state.bookmarks]
  )

  const clearAllBookmarks = useCallback(() => {
    setState((prev) => ({ ...prev, bookmarks: [] }))
  }, [])

  // arXiv bookmark functions
  const addArxivBookmark = useCallback((paper) => {
    setState((prev) => {
      if (prev.arxivBookmarks.some((b) => b.id === paper.id)) {
        return prev
      }
      return {
        ...prev,
        arxivBookmarks: [
          {
            id: paper.id,
            title: paper.title,
            authors: paper.authors.slice(0, 3),
            absLink: paper.absLink,
            savedAt: Date.now(),
          },
          ...prev.arxivBookmarks,
        ],
      }
    })
  }, [])

  const removeArxivBookmark = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      arxivBookmarks: prev.arxivBookmarks.filter((b) => b.id !== id),
    }))
  }, [])

  const isArxivBookmarked = useCallback(
    (id) => state.arxivBookmarks.some((b) => b.id === id),
    [state.arxivBookmarks]
  )

  const clearAllArxivBookmarks = useCallback(() => {
    setState((prev) => ({ ...prev, arxivBookmarks: [] }))
  }, [])

  return {
    theme: state.theme,
    categories: state.categories,
    bookmarks: state.bookmarks,
    arxivBookmarks: state.arxivBookmarks,
    setTheme,
    toggleCategory,
    setCategories,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
    addArxivBookmark,
    removeArxivBookmark,
    isArxivBookmarked,
    clearAllArxivBookmarks,
  }
}
