import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Settings, Bookmark, RefreshCw, Info, Heart } from 'lucide-react'
import { useWikiScraper } from './hooks/useWikiScraper'
import { useLocalStorage } from './hooks/useLocalStorage'
import Feed from './components/Feed'
import ArxivFeed from './components/ArxivFeed'
import ArtFeed from './components/ArtFeed'
import NasaFeed from './components/NasaFeed'
import HistoryFeed from './components/HistoryFeed'
import SettingsModal from './components/SettingsModal'
import SavedArticles from './components/SavedArticles'
import InfoModal from './components/InfoModal'
import Toast from './components/Toast'

const ALL_TABS = {
  wiki: { id: 'wiki', label: 'Wiki' },
  arxiv: { id: 'arxiv', label: 'arXiv' },
  art: { id: 'art', label: 'Art' },
  nasa: { id: 'nasa', label: 'NASA' },
  history: { id: 'history', label: 'Today' },
}

function App() {
  const [view, setView] = useState('feed')
  const [activeTab, setActiveTab] = useState('wiki')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [toast, setToast] = useState({ visible: false, loading: false })
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)

  const {
    theme, categories, arxivCategory, tabOrder, setTheme, toggleCategory, setArxivCategory, setTabOrder,
    // Wikipedia
    bookmarks, addBookmark, removeBookmark, isBookmarked, clearAllBookmarks,
    // arXiv
    arxivBookmarks, addArxivBookmark, removeArxivBookmark, isArxivBookmarked, clearAllArxivBookmarks,
    // Art
    artBookmarks, addArtBookmark, removeArtBookmark, isArtBookmarked, clearAllArtBookmarks,
    // NASA
    nasaBookmarks, addNasaBookmark, removeNasaBookmark, isNasaBookmarked, clearAllNasaBookmarks,
    // History
    historyBookmarks, addHistoryBookmark, removeHistoryBookmark, isHistoryBookmarked, clearAllHistoryBookmarks,
  } = useLocalStorage()

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

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY.current
      const scrolledPastThreshold = currentScrollY > 80
      
      if (scrollingDown && scrolledPastThreshold) {
        setHeaderVisible(false)
      } else if (!scrollingDown) {
        setHeaderVisible(true)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useWikiScraper(categories)

  const articles = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.articles)
  }, [data])

  const handleToggleBookmark = (article) => {
    isBookmarked(article.pageid) ? removeBookmark(article.pageid) : addBookmark(article)
  }

  const handleToggleArxivBookmark = (paper) => {
    isArxivBookmarked(paper.id) ? removeArxivBookmark(paper.id) : addArxivBookmark(paper)
  }

  const handleToggleArtBookmark = (artwork) => {
    isArtBookmarked(artwork.id) ? removeArtBookmark(artwork.id) : addArtBookmark(artwork)
  }

  const handleToggleNasaBookmark = (entry) => {
    isNasaBookmarked(entry.id) ? removeNasaBookmark(entry.id) : addNasaBookmark(entry)
  }

  const handleToggleHistoryBookmark = (event) => {
    isHistoryBookmarked(event.id) ? removeHistoryBookmark(event.id) : addHistoryBookmark(event)
  }

  const handleRefresh = useCallback(async () => {
    setToast({ visible: true, loading: true })
    try {
      await refetch()
      setToast({ visible: true, loading: false })
    } catch (e) {
      setToast({ visible: false, loading: false })
    }
  }, [refetch])

  const showToast = useCallback((loading) => {
    setToast({ visible: true, loading })
  }, [])

  const hideToast = useCallback(() => {
    setToast({ visible: false, loading: false })
  }, [])

  const totalBookmarks = bookmarks.length + arxivBookmarks.length + artBookmarks.length + nasaBookmarks.length + historyBookmarks.length

  if (view === 'saved') {
    return (
      <SavedArticles
        bookmarks={bookmarks}
        arxivBookmarks={arxivBookmarks}
        artBookmarks={artBookmarks}
        nasaBookmarks={nasaBookmarks}
        historyBookmarks={historyBookmarks}
        onRemoveBookmark={removeBookmark}
        onRemoveArxivBookmark={removeArxivBookmark}
        onRemoveArtBookmark={removeArtBookmark}
        onRemoveNasaBookmark={removeNasaBookmark}
        onRemoveHistoryBookmark={removeHistoryBookmark}
        onClearAll={clearAllBookmarks}
        onClearAllArxiv={clearAllArxivBookmarks}
        onClearAllArt={clearAllArtBookmarks}
        onClearAllNasa={clearAllNasaBookmarks}
        onClearAllHistory={clearAllHistoryBookmarks}
        onBack={() => setView('feed')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-300">
      <header className={`sticky top-0 z-40 bg-white/90 dark:bg-ink-950/90 backdrop-blur-md border-b border-ink-100 dark:border-ink-800 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ink-900 dark:bg-ink-100 rounded-lg flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-white dark:text-ink-900">W</span>
            </div>
            <h1 className="font-serif text-xl font-semibold text-ink-900 dark:text-ink-50 hidden sm:block">
              WikiWisch
            </h1>
          </div>

          <nav className="flex items-center gap-1">
            {activeTab === 'wiki' && (
              <button
                onClick={handleRefresh}
                disabled={toast.loading}
                className={`p-2.5 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors ${toast.loading ? 'opacity-50' : ''}`}
                aria-label="Refresh feed"
              >
                <RefreshCw className={`w-5 h-5 ${toast.loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            
            <button
              onClick={() => setView('saved')}
              className="relative p-2.5 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
              aria-label="Saved"
            >
              <Bookmark className="w-5 h-5" />
              {totalBookmarks > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 text-xs font-sans font-semibold rounded-full flex items-center justify-center">
                  {totalBookmarks > 9 ? '9+' : totalBookmarks}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2.5 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={() => setInfoOpen(true)}
              className="p-2.5 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
              aria-label="About"
            >
              <Info className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 border-b border-transparent -mb-px min-w-max">
            {tabOrder.map((tabId) => {
              const tab = ALL_TABS[tabId]
              if (!tab) return null
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2.5 font-sans text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors
                    ${activeTab === tab.id 
                      ? 'border-ink-900 dark:border-ink-100 text-ink-900 dark:text-ink-100' 
                      : 'border-transparent text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {activeTab === 'wiki' && (
          <>
            {articles.length === 0 && !isLoading && !error && (
              <div className="text-center py-12 mb-8 animate-fade-in">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink-900 dark:text-ink-50 mb-4">
                  Endless Discovery
                </h2>
                <p className="font-sans text-lg text-ink-500 dark:text-ink-400 max-w-md mx-auto">
                  Scroll through an infinite stream of knowledge.
                </p>
              </div>
            )}
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
          </>
        )}

        {activeTab === 'arxiv' && (
          <>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-semibold text-ink-900 dark:text-ink-50 mb-2">Latest Papers</h2>
              <p className="font-sans text-sm text-ink-500 dark:text-ink-400">Fresh research from arXiv</p>
            </div>
            <ArxivFeed
              arxivCategory={arxivCategory}
              arxivBookmarks={arxivBookmarks}
              isArxivBookmarked={isArxivBookmarked}
              onToggleArxivBookmark={handleToggleArxivBookmark}
              showToast={showToast}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </>
        )}

        {activeTab === 'art' && (
          <>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-semibold text-ink-900 dark:text-ink-50 mb-2">Art Collection</h2>
              <p className="font-sans text-sm text-ink-500 dark:text-ink-400">Public domain masterpieces from the Art Institute of Chicago</p>
            </div>
            <ArtFeed
              isArtBookmarked={isArtBookmarked}
              onToggleArtBookmark={handleToggleArtBookmark}
              showToast={showToast}
            />
          </>
        )}

        {activeTab === 'nasa' && (
          <>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-semibold text-ink-900 dark:text-ink-50 mb-2">Astronomy Picture of the Day</h2>
              <p className="font-sans text-sm text-ink-500 dark:text-ink-400">Daily cosmic discoveries from NASA</p>
            </div>
            <NasaFeed
              isNasaBookmarked={isNasaBookmarked}
              onToggleNasaBookmark={handleToggleNasaBookmark}
              showToast={showToast}
            />
          </>
        )}

        {activeTab === 'history' && (
          <>
            <HistoryFeed
              isHistoryBookmarked={isHistoryBookmarked}
              onToggleHistoryBookmark={handleToggleHistoryBookmark}
              showToast={showToast}
            />
          </>
        )}
      </main>

      <footer className="border-t border-ink-100 dark:border-ink-800 py-8 mt-12">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-2">
          <p className="font-sans text-sm text-ink-400 dark:text-ink-500">
            Content from{' '}
            <a href="https://www.wikipedia.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-600 dark:hover:text-ink-300">Wikipedia</a>,{' '}
            <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-600 dark:hover:text-ink-300">arXiv</a>,{' '}
            <a href="https://www.artic.edu" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-600 dark:hover:text-ink-300">Art Institute of Chicago</a>,{' '}
            <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-600 dark:hover:text-ink-300">NASA</a>
          </p>
          <p className="font-sans text-sm text-ink-400 dark:text-ink-500 flex items-center justify-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by{' '}
            <a href="https://github.com/MaxMLang" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-ink-600 dark:hover:text-ink-300">MaxMLang</a>
          </p>
        </div>
      </footer>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} setTheme={setTheme} categories={categories} toggleCategory={toggleCategory} arxivCategory={arxivCategory} setArxivCategory={setArxivCategory} tabOrder={tabOrder} setTabOrder={setTabOrder} />
      <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
      <Toast isVisible={toast.visible} isLoading={toast.loading} message="Refreshed!" onHide={hideToast} />
    </div>
  )
}

export default App
