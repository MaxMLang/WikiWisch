import { useState, useEffect, useMemo, useCallback } from 'react'
import { Settings, Bookmark, RefreshCw, Info, Heart } from 'lucide-react'
import { useWikiScraper } from './hooks/useWikiScraper'
import { useLocalStorage } from './hooks/useLocalStorage'
import Feed from './components/Feed'
import SettingsModal from './components/SettingsModal'
import SavedArticles from './components/SavedArticles'
import InfoModal from './components/InfoModal'
import Toast from './components/Toast'

function App() {
  const [view, setView] = useState('feed') // 'feed' | 'saved'
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [toast, setToast] = useState({ visible: false, loading: false })

  const {
    theme,
    categories,
    bookmarks,
    setTheme,
    toggleCategory,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
  } = useLocalStorage()

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => root.classList.toggle('dark', e.matches)
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  // Fetch articles based on selected categories
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useWikiScraper(categories)

  // Flatten paginated data into single array
  const articles = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.articles)
  }, [data])

  // Handle bookmark toggle
  const handleToggleBookmark = (article) => {
    if (isBookmarked(article.pageid)) {
      removeBookmark(article.pageid)
    } else {
      addBookmark(article)
    }
  }

  // Handle refresh with toast notification
  const handleRefresh = useCallback(async () => {
    setToast({ visible: true, loading: true })
    try {
      await refetch()
      setToast({ visible: true, loading: false })
    } catch (e) {
      setToast({ visible: false, loading: false })
    }
  }, [refetch])

  const hideToast = useCallback(() => {
    setToast({ visible: false, loading: false })
  }, [])

  // Show saved articles view
  if (view === 'saved') {
    return (
      <SavedArticles
        bookmarks={bookmarks}
        onRemoveBookmark={removeBookmark}
        onClearAll={clearAllBookmarks}
        onBack={() => setView('feed')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-ink-950/90 backdrop-blur-md border-b border-ink-100 dark:border-ink-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ink-900 dark:bg-ink-100 rounded-lg flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-white dark:text-ink-900">W</span>
            </div>
            <h1 className="font-serif text-xl font-semibold text-ink-900 dark:text-ink-50 hidden sm:block">
              WikiScroll
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              disabled={toast.loading}
              className={`p-2.5 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors ${toast.loading ? 'opacity-50' : ''}`}
              aria-label="Refresh feed"
              title="Refresh feed"
            >
              <RefreshCw className={`w-5 h-5 ${toast.loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setView('saved')}
              className="relative p-2.5 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
              aria-label="View saved articles"
              title="Saved articles"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 text-xs font-sans font-semibold rounded-full flex items-center justify-center">
                  {bookmarks.length > 9 ? '9+' : bookmarks.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2.5 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
              aria-label="Open settings"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={() => setInfoOpen(true)}
              className="p-2.5 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
              aria-label="About WikiScroll"
              title="About"
            >
              <Info className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero Section - only show on first load */}
        {articles.length === 0 && !isLoading && !error && (
          <div className="text-center py-12 mb-8 animate-fade-in">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink-900 dark:text-ink-50 mb-4">
              Endless Discovery
            </h2>
            <p className="font-sans text-lg text-ink-500 dark:text-ink-400 max-w-md mx-auto">
              Scroll through an infinite stream of knowledge. Every scroll reveals something new to learn.
            </p>
          </div>
        )}

        {/* Feed */}
        <Feed
          articles={articles}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          error={error}
          refetch={refetch}
          isBookmarked={isBookmarked}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-100 dark:border-ink-800 py-8 mt-12">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-2">
          <p className="font-sans text-sm text-ink-400 dark:text-ink-500">
            Content from{' '}
            <a 
              href="https://www.wikipedia.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-ink-600 dark:hover:text-ink-300"
            >
              Wikipedia
            </a>
          </p>
          <p className="font-sans text-sm text-ink-400 dark:text-ink-500 flex items-center justify-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by{' '}
            <a 
              href="https://github.com/MaxMLang" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-medium hover:text-ink-600 dark:hover:text-ink-300"
            >
              MaxMLang
            </a>
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        categories={categories}
        toggleCategory={toggleCategory}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={infoOpen}
        onClose={() => setInfoOpen(false)}
      />

      {/* Toast Notification */}
      <Toast
        isVisible={toast.visible}
        isLoading={toast.loading}
        message="Feed refreshed!"
        onHide={hideToast}
      />
    </div>
  )
}

export default App
