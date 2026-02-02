import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Loader2, AlertCircle, RefreshCw, ChevronDown, Check } from 'lucide-react'
import { useArxivScraper, ARXIV_CATEGORIES } from '../hooks/useArxivScraper'
import ArxivCard from './ArxivCard'

export default function ArxivFeed({ 
  arxivBookmarks,
  isArxivBookmarked,
  onToggleArxivBookmark,
  showToast
}) {
  const [selectedCategory, setSelectedCategory] = useState('cs.AI')
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const loadMoreRef = useRef(null)
  const pickerRef = useRef(null)

  // Pass as array for the hook (keeps API consistent)
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useArxivScraper(selectedCategory ? [selectedCategory] : [])

  // Flatten paginated data
  const papers = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.papers)
  }, [data])

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries) => {
    const [target] = entries
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '400px',
      threshold: 0,
    })

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [handleObserver])

  // Close picker on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowCategoryPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectCategory = (catId) => {
    setSelectedCategory(catId)
    setShowCategoryPicker(false)
  }

  const handleRefresh = async () => {
    showToast(true)
    await refetch()
    showToast(false)
  }

  // Group categories
  const groupedCategories = ARXIV_CATEGORIES.reduce((acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = []
    acc[cat.group].push(cat)
    return acc
  }, {})

  // Get current category label
  const currentCategory = ARXIV_CATEGORIES.find((c) => c.id === selectedCategory)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-ink-200 dark:border-ink-700 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-ink-900 dark:border-t-ink-100 rounded-full animate-spin" />
        </div>
        <p className="font-serif text-lg text-ink-500 dark:text-ink-400 animate-pulse-subtle">
          Fetching papers...
        </p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <AlertCircle className="w-12 h-12 text-ink-400 dark:text-ink-500" />
        <p className="font-serif text-lg text-ink-600 dark:text-ink-400 text-center">
          Couldn't fetch papers from arXiv.
        </p>
        <button
          onClick={handleRefresh}
          className="
            flex items-center gap-2 px-6 py-3
            font-sans font-medium text-sm
            bg-ink-900 dark:bg-ink-100
            text-white dark:text-ink-900
            rounded-full
            hover:bg-ink-700 dark:hover:bg-ink-300
            transition-colors
          "
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Category Selector */}
      <div className="mb-8 relative" ref={pickerRef}>
        <button
          onClick={() => setShowCategoryPicker(!showCategoryPicker)}
          className="
            flex items-center gap-2 px-4 py-2.5
            bg-white dark:bg-ink-900
            border border-ink-200 dark:border-ink-700
            rounded-lg
            hover:border-ink-400 dark:hover:border-ink-500
            transition-colors
            w-full sm:w-auto
          "
        >
          <span className="font-sans text-sm text-ink-600 dark:text-ink-400">
            Topic:
          </span>
          <span className="font-sans text-sm font-medium text-ink-900 dark:text-ink-100">
            {currentCategory?.label || 'Select topic'}
          </span>
          <ChevronDown className={`w-4 h-4 text-ink-400 transition-transform ${showCategoryPicker ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {showCategoryPicker && (
          <div className="
            absolute top-full left-0 mt-2 z-50
            w-full sm:w-80
            max-h-80 overflow-y-auto
            bg-white dark:bg-ink-900
            border border-ink-200 dark:border-ink-700
            rounded-lg shadow-xl
            animate-fade-in
          ">
            {Object.entries(groupedCategories).map(([group, cats]) => (
              <div key={group} className="border-b border-ink-100 dark:border-ink-800 last:border-0">
                <p className="px-4 py-2 text-xs font-sans font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 bg-ink-50 dark:bg-ink-800/50">
                  {group}
                </p>
                {cats.map((cat) => {
                  const isSelected = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat.id)}
                      className={`
                        w-full flex items-center justify-between px-4 py-2.5
                        text-left text-sm font-sans
                        hover:bg-ink-50 dark:hover:bg-ink-800
                        transition-colors
                        ${isSelected ? 'text-ink-900 dark:text-ink-100 bg-ink-50 dark:bg-ink-800' : 'text-ink-600 dark:text-ink-400'}
                      `}
                    >
                      <span>{cat.label}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Papers */}
      {papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="font-serif text-lg text-ink-500 dark:text-ink-400 text-center">
            No papers found for this topic.
          </p>
          <p className="font-sans text-sm text-ink-400 dark:text-ink-500 text-center">
            Try selecting a different category.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {papers.map((paper, index) => (
            <ArxivCard
              key={`${paper.id}-${index}`}
              paper={paper}
              index={index}
              isBookmarked={isArxivBookmarked(paper.id)}
              onToggleBookmark={onToggleArxivBookmark}
            />
          ))}
        </div>
      )}

      {/* Load More Trigger */}
      <div 
        ref={loadMoreRef} 
        className="w-full py-12 flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-ink-400 dark:text-ink-500 animate-spin" />
            <span className="font-sans text-sm text-ink-500 dark:text-ink-400">
              Loading more papers...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
