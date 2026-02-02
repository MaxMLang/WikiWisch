import { useState } from 'react'
import { 
  BookmarkX, 
  ExternalLink, 
  Trash2, 
  ArrowLeft,
  BookOpen,
  FileText,
  Palette,
  Sparkles,
  History,
  Users,
  FlaskConical
} from 'lucide-react'

const TABS = [
  { id: 'wiki', label: 'Wiki', icon: BookOpen },
  { id: 'arxiv', label: 'arXiv', icon: FileText },
  { id: 'preprints', label: 'Preprints', icon: FlaskConical },
  { id: 'art', label: 'Art', icon: Palette },
  { id: 'nasa', label: 'NASA', icon: Sparkles },
  { id: 'history', label: 'Today', icon: History },
]

export default function SavedArticles({ 
  bookmarks = [], 
  arxivBookmarks = [],
  preprintBookmarks = [],
  artBookmarks = [],
  nasaBookmarks = [],
  historyBookmarks = [],
  onRemoveBookmark, 
  onRemoveArxivBookmark,
  onRemovePreprintBookmark,
  onRemoveArtBookmark,
  onRemoveNasaBookmark,
  onRemoveHistoryBookmark,
  onClearAll,
  onClearAllArxiv,
  onClearAllPreprints,
  onClearAllArt,
  onClearAllNasa,
  onClearAllHistory,
  onBack 
}) {
  const [activeTab, setActiveTab] = useState('wiki')
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const bookmarkCounts = {
    wiki: bookmarks.length,
    arxiv: arxivBookmarks.length,
    preprints: preprintBookmarks.length,
    art: artBookmarks.length,
    nasa: nasaBookmarks.length,
    history: historyBookmarks.length,
  }

  const totalCount = Object.values(bookmarkCounts).reduce((a, b) => a + b, 0)

  const getCurrentBookmarks = () => {
    switch (activeTab) {
      case 'arxiv': return arxivBookmarks
      case 'preprints': return preprintBookmarks
      case 'art': return artBookmarks
      case 'nasa': return nasaBookmarks
      case 'history': return historyBookmarks
      default: return bookmarks
    }
  }

  const handleClearAll = () => {
    switch (activeTab) {
      case 'arxiv': onClearAllArxiv(); break
      case 'preprints': onClearAllPreprints(); break
      case 'art': onClearAllArt(); break
      case 'nasa': onClearAllNasa(); break
      case 'history': onClearAllHistory(); break
      default: onClearAll()
    }
    setShowConfirmClear(false)
  }

  const currentBookmarks = getCurrentBookmarks()

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-ink-950/90 backdrop-blur-md border-b border-ink-100 dark:border-ink-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-xl font-semibold text-ink-900 dark:text-ink-50">Saved</h1>
            <span className="px-2 py-0.5 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 text-xs font-sans font-medium rounded-full">
              {totalCount}
            </span>
          </div>
          
          {currentBookmarks.length > 0 && (
            <button onClick={() => setShowConfirmClear(true)} className="p-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 dark:text-ink-400 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="max-w-2xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 border-b border-transparent -mb-px min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-3 py-2.5 font-sans text-sm font-medium whitespace-nowrap
                  border-b-2 transition-colors flex items-center gap-1.5
                  ${activeTab === tab.id 
                    ? 'border-ink-900 dark:border-ink-100 text-ink-900 dark:text-ink-100' 
                    : 'border-transparent text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300'
                  }
                `}
              >
                {tab.label}
                {bookmarkCounts[tab.id] > 0 && (
                  <span className="text-xs opacity-60">({bookmarkCounts[tab.id]})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {showConfirmClear && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 dark:bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-ink-900 rounded-lg shadow-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 mb-2">Clear bookmarks?</h3>
            <p className="font-sans text-sm text-ink-500 dark:text-ink-400 mb-6">
              This will remove {currentBookmarks.length} saved items.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmClear(false)} className="flex-1 px-4 py-2 font-sans font-medium text-sm border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-300 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleClearAll} className="flex-1 px-4 py-2 font-sans font-medium text-sm bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 rounded-lg hover:bg-ink-700 dark:hover:bg-ink-300 transition-colors">
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-8">
        {currentBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-ink-400 dark:text-ink-500" />
            </div>
            <p className="font-serif text-lg text-ink-500 dark:text-ink-400 text-center">No saved items</p>
            <button onClick={onBack} className="mt-4 px-6 py-3 font-sans font-medium text-sm bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 rounded-full hover:bg-ink-700 dark:hover:bg-ink-300 transition-colors">
              Browse Content
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Wikipedia */}
            {activeTab === 'wiki' && bookmarks.map((item) => (
              <article key={item.pageid} className="flex gap-4 p-4 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-lg card-shadow">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt="" className="w-20 h-20 object-cover rounded bg-ink-100 dark:bg-ink-800 flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded bg-ink-100 dark:bg-ink-800 flex-shrink-0 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-ink-300 dark:text-ink-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 truncate">{item.title}</h3>
                  <p className="font-sans text-xs text-ink-400 dark:text-ink-500 mt-1">Saved {new Date(item.savedAt).toLocaleDateString()}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700 rounded-full hover:border-ink-400 dark:hover:border-ink-500 transition-colors">
                      Read <ExternalLink className="w-3 h-3" />
                    </a>
                    <button onClick={() => onRemoveBookmark(item.pageid)} className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors">
                      <BookmarkX className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* arXiv */}
            {activeTab === 'arxiv' && arxivBookmarks.map((item) => (
              <article key={item.id} className="p-4 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-lg card-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-sans font-semibold rounded">arXiv</span>
                  <span className="text-xs font-mono text-ink-400 dark:text-ink-500">{item.id}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 mb-2 line-clamp-2">{item.title}</h3>
                {item.authors?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>{item.authors.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <a href={item.absLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700 rounded-full hover:border-ink-400 dark:hover:border-ink-500 transition-colors">
                    Read <ExternalLink className="w-3 h-3" />
                  </a>
                  <button onClick={() => onRemoveArxivBookmark(item.id)} className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors">
                    <BookmarkX className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </article>
            ))}

            {/* Preprints (med/bioRxiv) */}
            {activeTab === 'preprints' && preprintBookmarks.map((item) => (
              <article key={item.id} className="p-4 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-lg card-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-sans font-semibold rounded ${
                    item.server === 'medrxiv' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  }`}>
                    {item.server === 'medrxiv' ? 'medRxiv' : 'bioRxiv'}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 mb-2 line-clamp-2">{item.title}</h3>
                {item.authors?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>{item.authors.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <a href={item.absLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700 rounded-full hover:border-ink-400 dark:hover:border-ink-500 transition-colors">
                    Read <ExternalLink className="w-3 h-3" />
                  </a>
                  <button onClick={() => onRemovePreprintBookmark(item.id)} className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors">
                    <BookmarkX className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </article>
            ))}

            {/* Art */}
            {activeTab === 'art' && artBookmarks.map((item) => (
              <article key={item.id} className="flex gap-4 p-4 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-lg card-shadow">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt="" className="w-20 h-20 object-cover rounded bg-ink-100 dark:bg-ink-800 flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded bg-ink-100 dark:bg-ink-800 flex-shrink-0 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-ink-300 dark:text-ink-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 truncate">{item.title}</h3>
                  <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-1">{item.artist}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <a href={item.detailUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700 rounded-full hover:border-ink-400 dark:hover:border-ink-500 transition-colors">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                    <button onClick={() => onRemoveArtBookmark(item.id)} className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors">
                      <BookmarkX className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* NASA */}
            {activeTab === 'nasa' && nasaBookmarks.map((item) => (
              <article key={item.id} className="flex gap-4 p-4 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-lg card-shadow">
                {item.url ? (
                  <img src={item.url} alt="" className="w-20 h-20 object-cover rounded bg-ink-900 flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded bg-ink-900 flex-shrink-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-ink-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 truncate">{item.title}</h3>
                  <p className="font-sans text-xs text-ink-400 dark:text-ink-500 mt-1">{item.date}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {item.hdUrl && (
                      <a href={item.hdUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700 rounded-full hover:border-ink-400 dark:hover:border-ink-500 transition-colors">
                        View HD <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button onClick={() => onRemoveNasaBookmark(item.id)} className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors">
                      <BookmarkX className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* History */}
            {activeTab === 'history' && historyBookmarks.map((item) => (
              <article key={item.id} className="p-4 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-lg card-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-sans font-semibold rounded capitalize">{item.type}</span>
                  <span className="text-sm font-mono font-semibold text-ink-900 dark:text-ink-100">{item.year}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 mb-1">{item.title}</h3>
                <p className="font-sans text-sm text-ink-600 dark:text-ink-400 line-clamp-2">{item.text}</p>
                <div className="flex items-center gap-2 mt-3">
                  {item.wikiUrl && (
                    <a href={item.wikiUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700 rounded-full hover:border-ink-400 dark:hover:border-ink-500 transition-colors">
                      Wikipedia <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button onClick={() => onRemoveHistoryBookmark(item.id)} className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors">
                    <BookmarkX className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
