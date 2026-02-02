import { useEffect, useRef, useCallback, useMemo } from 'react'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { useNasaScraper } from '../hooks/useNasaScraper'
import NasaCard from './NasaCard'

export default function NasaFeed({ 
  isNasaBookmarked,
  onToggleNasaBookmark,
  showToast
}) {
  const loadMoreRef = useRef(null)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useNasaScraper()

  const entries = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.entries)
  }, [data])

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

  const handleRefresh = async () => {
    showToast(true)
    await refetch()
    showToast(false)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-ink-200 dark:border-ink-700 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-ink-900 dark:border-t-ink-100 rounded-full animate-spin" />
        </div>
        <p className="font-serif text-lg text-ink-500 dark:text-ink-400 animate-pulse-subtle">
          Reaching for the stars...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <AlertCircle className="w-12 h-12 text-ink-400 dark:text-ink-500" />
        <p className="font-serif text-lg text-ink-600 dark:text-ink-400 text-center">
          Couldn't fetch from NASA.
        </p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-6 py-3 font-sans font-medium text-sm bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 rounded-full hover:bg-ink-700 dark:hover:bg-ink-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <NasaCard
            key={`${entry.id}-${index}`}
            entry={entry}
            index={index}
            isBookmarked={isNasaBookmarked(entry.id)}
            onToggleBookmark={onToggleNasaBookmark}
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="w-full py-12 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-ink-400 dark:text-ink-500 animate-spin" />
            <span className="font-sans text-sm text-ink-500 dark:text-ink-400">
              Loading more images...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
