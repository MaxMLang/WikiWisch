import { useEffect, useRef } from 'react'
import { X, Sun, Moon, Monitor, Check, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import { ARXIV_CATEGORIES } from '../hooks/useArxivScraper'

const AVAILABLE_CATEGORIES = [
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'history', label: 'History', emoji: '📜' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'arts', label: 'Arts & Culture', emoji: '🎨' },
  { id: 'geography', label: 'Geography', emoji: '🌍' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'philosophy', label: 'Philosophy', emoji: '💭' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
]

const THEME_OPTIONS = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
]

const ALL_TABS = {
  wiki: { label: 'Wikipedia', emoji: '📖' },
  arxiv: { label: 'arXiv', emoji: '📄' },
  art: { label: 'Art', emoji: '🎨' },
  nasa: { label: 'NASA', emoji: '🚀' },
  history: { label: 'On This Day', emoji: '📅' },
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  theme, 
  setTheme, 
  categories, 
  toggleCategory,
  arxivCategory,
  setArxivCategory,
  tabOrder,
  setTabOrder
}) {
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

  const moveTab = (index, direction) => {
    const newOrder = [...tabOrder]
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= newOrder.length) return
    ;[newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]]
    setTabOrder(newOrder)
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-ink-900/50 dark:bg-ink-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-ink-900 sm:rounded-lg rounded-t-2xl shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="sticky top-0 bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 px-6 py-4 flex items-center justify-between">
          <h2 id="settings-title" className="font-serif text-xl font-semibold text-ink-900 dark:text-ink-50">
            Settings
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 dark:text-ink-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Theme Selection */}
          <section>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-4">
              Appearance
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className={`
                    flex flex-col items-center gap-2 p-4 border rounded-lg transition-all
                    ${theme === id 
                      ? 'border-ink-900 dark:border-ink-100 bg-ink-50 dark:bg-ink-800' 
                      : 'border-ink-200 dark:border-ink-700 hover:border-ink-300 dark:hover:border-ink-600'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${theme === id ? 'text-ink-900 dark:text-ink-100' : 'text-ink-400 dark:text-ink-500'}`} />
                  <span className={`font-sans text-sm ${theme === id ? 'text-ink-900 dark:text-ink-100 font-medium' : 'text-ink-600 dark:text-ink-400'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Tab Order */}
          <section>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">
              Tab Order
            </h3>
            <p className="font-sans text-sm text-ink-500 dark:text-ink-500 mb-4">
              Reorder tabs using the arrows
            </p>
            <div className="space-y-2">
              {tabOrder.map((tabId, index) => {
                const tab = ALL_TABS[tabId]
                if (!tab) return null
                return (
                  <div
                    key={tabId}
                    className="flex items-center gap-3 p-3 bg-ink-50 dark:bg-ink-800/50 rounded-lg"
                  >
                    <GripVertical className="w-4 h-4 text-ink-300 dark:text-ink-600" />
                    <span className="text-lg">{tab.emoji}</span>
                    <span className="flex-1 font-sans text-sm font-medium text-ink-900 dark:text-ink-100">
                      {tab.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveTab(index, -1)}
                        disabled={index === 0}
                        className={`p-1.5 rounded ${index === 0 ? 'opacity-30' : 'hover:bg-ink-200 dark:hover:bg-ink-700'}`}
                      >
                        <ChevronUp className="w-4 h-4 text-ink-600 dark:text-ink-400" />
                      </button>
                      <button
                        onClick={() => moveTab(index, 1)}
                        disabled={index === tabOrder.length - 1}
                        className={`p-1.5 rounded ${index === tabOrder.length - 1 ? 'opacity-30' : 'hover:bg-ink-200 dark:hover:bg-ink-700'}`}
                      >
                        <ChevronDown className="w-4 h-4 text-ink-600 dark:text-ink-400" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Wikipedia Topics */}
          <section>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">
              Wikipedia Topics
            </h3>
            <p className="font-sans text-sm text-ink-500 dark:text-ink-500 mb-4">
              Filter Wikipedia articles by topic
            </p>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_CATEGORIES.map(({ id, label, emoji }) => {
                const isSelected = categories.includes(id)
                return (
                  <button
                    key={id}
                    onClick={() => toggleCategory(id)}
                    className={`
                      flex items-center gap-3 p-3 border rounded-lg transition-all text-left
                      ${isSelected 
                        ? 'border-ink-900 dark:border-ink-100 bg-ink-50 dark:bg-ink-800' 
                        : 'border-ink-200 dark:border-ink-700 hover:border-ink-300 dark:hover:border-ink-600'
                      }
                    `}
                  >
                    <span className="text-xl">{emoji}</span>
                    <span className={`font-sans text-sm flex-1 ${isSelected ? 'text-ink-900 dark:text-ink-100 font-medium' : 'text-ink-600 dark:text-ink-400'}`}>
                      {label}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-ink-900 dark:text-ink-100" />}
                  </button>
                )
              })}
            </div>
          </section>

          {/* arXiv Topic */}
          <section>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">
              arXiv Topic
            </h3>
            <p className="font-sans text-sm text-ink-500 dark:text-ink-500 mb-4">
              Select research area for arXiv papers
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(
                ARXIV_CATEGORIES.reduce((acc, cat) => {
                  if (!acc[cat.group]) acc[cat.group] = []
                  acc[cat.group].push(cat)
                  return acc
                }, {})
              ).map(([group, cats]) => (
                <div key={group}>
                  <p className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 mb-2 mt-3 first:mt-0">
                    {group}
                  </p>
                  <div className="space-y-1">
                    {cats.map((cat) => {
                      const isSelected = arxivCategory === cat.id
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setArxivCategory(cat.id)}
                          className={`
                            w-full flex items-center justify-between p-3 border rounded-lg transition-all text-left
                            ${isSelected 
                              ? 'border-ink-900 dark:border-ink-100 bg-ink-50 dark:bg-ink-800' 
                              : 'border-ink-200 dark:border-ink-700 hover:border-ink-300 dark:hover:border-ink-600'
                            }
                          `}
                        >
                          <span className={`font-sans text-sm ${isSelected ? 'text-ink-900 dark:text-ink-100 font-medium' : 'text-ink-600 dark:text-ink-400'}`}>
                            {cat.label}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-ink-900 dark:text-ink-100" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* About */}
          <section className="pt-4 border-t border-ink-100 dark:border-ink-800">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">
              Data Sources
            </h3>
            <p className="font-sans text-sm text-ink-500 dark:text-ink-500 leading-relaxed">
              WikiWisch aggregates content from Wikipedia, arXiv, Art Institute of Chicago, and NASA. 
              All data is fetched in real-time. Your preferences are stored locally.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
