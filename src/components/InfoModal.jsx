import { useEffect, useRef } from 'react'
import { X, ExternalLink, Heart, Github } from 'lucide-react'

const SOURCES = [
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    description: 'The Free Encyclopedia',
    url: 'https://www.wikipedia.org',
    color: 'bg-ink-100 dark:bg-ink-800',
    textColor: 'text-ink-600 dark:text-ink-300',
    icon: 'W',
  },
  {
    id: 'arxiv',
    name: 'arXiv',
    description: 'Open Access Research',
    url: 'https://arxiv.org',
    color: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-600 dark:text-red-400',
    icon: 'arXiv',
    smallText: true,
  },
  {
    id: 'artic',
    name: 'Art Institute of Chicago',
    description: 'Public Domain Artworks',
    url: 'https://www.artic.edu',
    color: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    icon: '🎨',
    isEmoji: true,
  },
  {
    id: 'nasa',
    name: 'NASA',
    description: 'Astronomy Picture of the Day',
    url: 'https://api.nasa.gov',
    color: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    icon: '🚀',
    isEmoji: true,
  },
  {
    id: 'wikimedia',
    name: 'Wikimedia',
    description: 'On This Day in History',
    url: 'https://api.wikimedia.org',
    color: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    icon: '📅',
    isEmoji: true,
  },
]

export default function InfoModal({ isOpen, onClose }) {
  const modalRef = useRef(null)

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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-ink-900/50 dark:bg-ink-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-ink-900 sm:rounded-lg rounded-t-2xl shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-title"
      >
        <div className="sticky top-0 bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 px-6 py-4 flex items-center justify-between">
          <h2 id="info-title" className="font-serif text-xl font-semibold text-ink-900 dark:text-ink-50">
            About WikiWisch
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 dark:text-ink-400 transition-colors">
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
                <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50">WikiWisch</h3>
                <p className="font-sans text-sm text-ink-500 dark:text-ink-400">Endless knowledge discovery</p>
              </div>
            </div>
            <p className="font-sans text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
              WikiWisch serves you an endless feed of fascinating content from multiple sources — Wikipedia articles, 
              research papers, classic art, space imagery, and historical events. Scroll, learn, bookmark. No account needed.
            </p>
          </section>

          {/* Data Sources */}
          <section>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-3">
              Data Sources
            </h4>
            <div className="space-y-2">
              {SOURCES.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-ink-200 dark:border-ink-700 rounded-lg hover:border-ink-400 dark:hover:border-ink-500 hover:bg-ink-50 dark:hover:bg-ink-800/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 ${source.color} rounded-lg flex items-center justify-center`}>
                      {source.isEmoji ? (
                        <span className="text-lg">{source.icon}</span>
                      ) : (
                        <span className={`${source.smallText ? 'text-xs' : 'text-base'} font-bold ${source.textColor}`}>
                          {source.icon}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-sans text-sm font-medium text-ink-900 dark:text-ink-100">{source.name}</p>
                      <p className="font-sans text-xs text-ink-500 dark:text-ink-400">{source.description}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-ink-400 dark:text-ink-500 group-hover:text-ink-600 dark:group-hover:text-ink-300 transition-colors" />
                </a>
              ))}
            </div>
          </section>

          {/* License Info */}
          <section className="p-3 bg-ink-50 dark:bg-ink-800/50 rounded-lg">
            <p className="font-sans text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
              Wikipedia content is available under CC BY-SA 3.0. Art Institute images are public domain. 
              NASA images are generally public domain. arXiv papers are subject to individual author licenses.
            </p>
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
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 font-sans font-medium text-sm rounded-full hover:bg-ink-700 dark:hover:bg-ink-300 transition-colors"
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
