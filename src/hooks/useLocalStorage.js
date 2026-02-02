import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wikiwisch_data'

const defaultState = {
  theme: 'system',
  categories: ['science', 'history', 'technology', 'arts', 'geography'],
  bookmarks: [],
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

  return {
    theme: state.theme,
    categories: state.categories,
    bookmarks: state.bookmarks,
    setTheme,
    toggleCategory,
    setCategories,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
  }
}
