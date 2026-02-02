import { useEffect, useRef } from 'react'
import { X, ExternalLink, Heart, Github } from 'lucide-react'

export default function InfoModal({ isOpen, onClose }) {
  const modalRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Close on click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="
        fixed inset-0 z-50
        bg-ink-900/50 dark:bg-ink-950/80
        backdrop-blur-sm
        flex items-end sm:items-center justify-center
        p-0 sm:p-4
        animate-fade-in
      "
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="
          w-full sm:max-w-md
          max-h-[90vh] overflow-y-auto
          bg-white dark:bg-ink-900
          sm:rounded-lg
          rounded-t-2xl
          shadow-2xl
          animate-slide-up
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 px-6 py-4 flex items-center justify-between">
          <h2 id="info-title" className="font-serif text-xl font-semibold text-ink-900 dark:text-ink-50">
            About WikiScroll
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 dark:text-ink-400 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* App Description */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-ink-900 dark:bg-ink-100 rounded-xl flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-white dark:text-ink-900">W</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50">
                  WikiScroll
                </h3>
                <p className="font-sans text-sm text-ink-500 dark:text-ink-400">
                  Endless knowledge discovery
                </p>
              </div>
            </div>
            <p className="font-sans text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
              WikiScroll transforms Wikipedia into an infinite, TikTok-style feed of knowledge. 
              Scroll through fascinating articles, save your favorites, and customize your topics—all 
              without creating an account. Your preferences and bookmarks are stored locally in your browser.
            </p>
          </section>

          {/* Data Attribution */}
          <section className="p-4 bg-ink-50 dark:bg-ink-800/50 rounded-lg">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">
              Data Source
            </h4>
            <p className="font-sans text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-3">
              All content is fetched in real-time from the{' '}
              <a 
                href="https://en.wikipedia.org/api/rest_v1/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-medium hover:text-ink-900 dark:hover:text-ink-100"
              >
                Wikipedia REST API
              </a>
              . Article summaries, images, and metadata are provided by the Wikimedia Foundation.
            </p>
            <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
              Content is available under{' '}
              <a 
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-ink-700 dark:hover:text-ink-300"
              >
                CC BY-SA 3.0
              </a>
            </p>
          </section>

          {/* Wikipedia Credit */}
          <section>
            <a
              href="https://www.wikipedia.org"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center justify-between p-4
                border border-ink-200 dark:border-ink-700
                rounded-lg
                hover:border-ink-400 dark:hover:border-ink-500
                hover:bg-ink-50 dark:hover:bg-ink-800/50
                transition-all group
              "
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ink-100 dark:bg-ink-800 rounded-lg flex items-center justify-center">
                  <span className="font-serif text-lg font-bold text-ink-600 dark:text-ink-300">W</span>
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-ink-900 dark:text-ink-100">
                    Wikipedia
                  </p>
                  <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
                    The Free Encyclopedia
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-ink-400 dark:text-ink-500 group-hover:text-ink-600 dark:group-hover:text-ink-300 transition-colors" />
            </a>
          </section>

          {/* Creator Credit */}
          <section className="pt-4 border-t border-ink-100 dark:border-ink-800">
            <div className="text-center">
              <p className="font-sans text-sm text-ink-500 dark:text-ink-400 mb-4 flex items-center justify-center gap-1.5">
                Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by
              </p>
              <a
                href="https://github.com/MaxMLang"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2 px-5 py-2.5
                  bg-ink-900 dark:bg-ink-100
                  text-white dark:text-ink-900
                  font-sans font-medium text-sm
                  rounded-full
                  hover:bg-ink-700 dark:hover:bg-ink-300
                  transition-colors
                "
              >
                <Github className="w-4 h-4" />
                MaxMLang
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
