import { useState } from 'react'
import { 
  BookmarkX, 
  ExternalLink, 
  Trash2, 
  ArrowLeft,
  BookOpen,
  FileText,
  Users
} from 'lucide-react'

export default function SavedArticles({ 
  bookmarks, 
  arxivBookmarks = [],
  onRemoveBookmark, 
  onRemoveArxivBookmark,
  onClearAll,
  onClearAllArxiv, 
  onBack 
}) {
  const [activeTab, setActiveTab] = useState('wiki')
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const currentBookmarks = activeTab === 'wiki' ? bookmarks : arxivBookmarks
  const totalCount = bookmarks.length + arxivBookmarks.length

  const handleClearAll = () => {
    if (activeTab === 'wiki') {
      onClearAll()
    } else {
      onClearAllArxiv()
    }
    setShowConfirmClear(false)
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-ink-950/90 backdrop-blur-md border-b border-ink-100 dark:border-ink-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-xl font-semibold text-ink-900 dark:text-ink-50">
              Saved
            </h1>
            <span className="px-2 py-0.5 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 text-xs font-sans font-medium rounded-full">
              {totalCount}
            </span>
          </div>
          
          {currentBookmarks.length > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="p-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 dark:text-ink-400 transition-colors"
              aria-label="Clear all bookmarks"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-1 border-b border-transparent -mb-px">
            <button
              onClick={() => setActiveTab('wiki')}
              className={`
                px-4 py-2.5 font-sans text-sm font-medium
                border-b-2 transition-colors
                ${activeTab === 'wiki' 
                  ? 'border-ink-900 dark:border-ink-100 text-ink-900 dark:text-ink-100' 
                  : 'border-transparent text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300'
                }
              `}
            >
              Wikipedia ({bookmarks.length})
            </button>
            <button
              onClick={() => setActiveTab('arxiv')}
              className={`
                px-4 py-2.5 font-sans text-sm font-medium
                border-b-2 transition-colors
                ${activeTab === 'arxiv' 
                  ? 'border-ink-900 dark:border-ink-100 text-ink-900 dark:text-ink-100' 
                  : 'border-transparent text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300'
                }
              `}
            >
              arXiv ({arxivBookmarks.length})
            </button>
          </div>
        </div>
      </header>

      {/* Confirm Clear Dialog */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 dark:bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-ink-900 rounded-lg shadow-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 mb-2">
              Clear {activeTab === 'wiki' ? 'Wikipedia' : 'arXiv'} bookmarks?
            </h3>
            <p className="font-sans text-sm text-ink-500 dark:text-ink-400 mb-6">
              This will remove {currentBookmarks.length} saved {activeTab === 'wiki' ? 'articles' : 'papers'}. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="
                  flex-1 px-4 py-2
                  font-sans font-medium text-sm
                  border border-ink-200 dark:border-ink-700
                  text-ink-700 dark:text-ink-300
                  rounded-lg
                  hover:bg-ink-50 dark:hover:bg-ink-800
                  transition-colors
                "
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="
                  flex-1 px-4 py-2
                  font-sans font-medium text-sm
                  bg-ink-900 dark:bg-ink-100
                  text-white dark:text-ink-900
                  rounded-lg
                  hover:bg-ink-700 dark:hover:bg-ink-300
                  transition-colors
                "
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {currentBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
              {activeTab === 'wiki' ? (
                <BookOpen className="w-8 h-8 text-ink-400 dark:text-ink-500" />
              ) : (
                <FileText className="w-8 h-8 text-ink-400 dark:text-ink-500" />
              )}
            </div>
            <p className="font-serif text-lg text-ink-500 dark:text-ink-400 text-center">
              No saved {activeTab === 'wiki' ? 'articles' : 'papers'} yet
            </p>
            <p className="font-sans text-sm text-ink-400 dark:text-ink-500 text-center">
              Bookmark {activeTab === 'wiki' ? 'articles' : 'papers'} from your feed to save them here.
            </p>
            <button
              onClick={onBack}
              className="
                mt-4 px-6 py-3
                font-sans font-medium text-sm
                bg-ink-900 dark:bg-ink-100
                text-white dark:text-ink-900
                rounded-full
                hover:bg-ink-700 dark:hover:bg-ink-300
                transition-colors
              "
            >
              Explore {activeTab === 'wiki' ? 'Articles' : 'Papers'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'wiki' ? (
              // Wikipedia bookmarks
              bookmarks.map((bookmark) => (
                <article
                  key={bookmark.pageid}
                  className="
                    flex gap-4 p-4
                    bg-white dark:bg-ink-900
                    border border-ink-200 dark:border-ink-800
                    rounded-lg
                    card-shadow
                    animate-fade-in
                  "
                >
                  {bookmark.thumbnail ? (
                    <img
                      src={bookmark.thumbnail}
                      alt=""
                      className="w-20 h-20 object-cover rounded bg-ink-100 dark:bg-ink-800 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded bg-ink-100 dark:bg-ink-800 flex-shrink-0 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-ink-300 dark:text-ink-600" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 truncate">
                      {bookmark.title}
                    </h3>
                    <p className="font-sans text-xs text-ink-400 dark:text-ink-500 mt-1">
                      Saved {new Date(bookmark.savedAt).toLocaleDateString()}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href={`https://en.wikipedia.org/wiki/${encodeURIComponent(bookmark.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex items-center gap-1.5 px-3 py-1.5
                          font-sans text-xs font-medium
                          text-ink-600 dark:text-ink-400
                          border border-ink-200 dark:border-ink-700
                          rounded-full
                          hover:border-ink-400 dark:hover:border-ink-500
                          transition-colors
                        "
                      >
                        Read
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => onRemoveBookmark(bookmark.pageid)}
                        className="
                          flex items-center gap-1.5 px-3 py-1.5
                          font-sans text-xs font-medium
                          text-ink-500 dark:text-ink-400
                          hover:text-ink-900 dark:hover:text-ink-100
                          transition-colors
                        "
                      >
                        <BookmarkX className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              // arXiv bookmarks
              arxivBookmarks.map((paper) => (
                <article
                  key={paper.id}
                  className="
                    p-4
                    bg-white dark:bg-ink-900
                    border border-ink-200 dark:border-ink-800
                    rounded-lg
                    card-shadow
                    animate-fade-in
                  "
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-sans font-semibold rounded">
                      arXiv
                    </span>
                    <span className="text-xs font-mono text-ink-400 dark:text-ink-500">
                      {paper.id}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 mb-2 line-clamp-2">
                    {paper.title}
                  </h3>

                  {paper.authors && paper.authors.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 mb-2">
                      <Users className="w-3.5 h-3.5" />
                      <span>{paper.authors.join(', ')}</span>
                    </div>
                  )}

                  <p className="font-sans text-xs text-ink-400 dark:text-ink-500 mb-3">
                    Saved {new Date(paper.savedAt).toLocaleDateString()}
                  </p>
                    
                  <div className="flex items-center gap-2">
                    <a
                      href={paper.absLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex items-center gap-1.5 px-3 py-1.5
                        font-sans text-xs font-medium
                        text-ink-600 dark:text-ink-400
                        border border-ink-200 dark:border-ink-700
                        rounded-full
                        hover:border-ink-400 dark:hover:border-ink-500
                        transition-colors
                      "
                    >
                      Read
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => onRemoveArxivBookmark(paper.id)}
                      className="
                        flex items-center gap-1.5 px-3 py-1.5
                        font-sans text-xs font-medium
                        text-ink-500 dark:text-ink-400
                        hover:text-ink-900 dark:hover:text-ink-100
                        transition-colors
                      "
                    >
                      <BookmarkX className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
