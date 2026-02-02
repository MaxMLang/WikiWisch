import { useState } from 'react'
import { 
  BookmarkX, 
  ExternalLink, 
  Trash2, 
  ArrowLeft,
  BookOpen 
} from 'lucide-react'

export default function SavedArticles({ 
  bookmarks, 
  onRemoveBookmark, 
  onClearAll, 
  onBack 
}) {
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const handleClearAll = () => {
    onClearAll()
    setShowConfirmClear(false)
  }

  return (
    <div className="min-h-screen">
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
              Saved Articles
            </h1>
          </div>
          
          {bookmarks.length > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="p-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 dark:text-ink-400 transition-colors"
              aria-label="Clear all bookmarks"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Confirm Clear Dialog */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 dark:bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-ink-900 rounded-lg shadow-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 mb-2">
              Clear all bookmarks?
            </h3>
            <p className="font-sans text-sm text-ink-500 dark:text-ink-400 mb-6">
              This will remove all {bookmarks.length} saved articles. This action cannot be undone.
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
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-ink-400 dark:text-ink-500" />
            </div>
            <p className="font-serif text-lg text-ink-500 dark:text-ink-400 text-center">
              No saved articles yet
            </p>
            <p className="font-sans text-sm text-ink-400 dark:text-ink-500 text-center">
              Bookmark articles from your feed to save them here.
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
              Explore Articles
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-sans text-sm text-ink-500 dark:text-ink-400 mb-6">
              {bookmarks.length} saved article{bookmarks.length !== 1 ? 's' : ''}
            </p>
            
            {bookmarks.map((bookmark) => (
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
                {/* Thumbnail */}
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

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 truncate">
                    {bookmark.title}
                  </h3>
                  <p className="font-sans text-xs text-ink-400 dark:text-ink-500 mt-1">
                    Saved {new Date(bookmark.savedAt).toLocaleDateString()}
                  </p>
                  
                  {/* Actions */}
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
                      aria-label={`Remove ${bookmark.title} from bookmarks`}
                    >
                      <BookmarkX className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
