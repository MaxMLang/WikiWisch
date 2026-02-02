import { useEffect, useRef, useCallback, useMemo } from 'react'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { useBiorxivScraper } from '../hooks/useBiorxivScraper'
import BiorxivCard from './BiorxivCard'

export default function BiorxivFeed({ 
  category = 'all',
  isPreprintBookmarked,
  onTogglePreprintBookmark,
  showToast,
  onOpenSettings
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
  } = useBiorxivScraper(category)

  const papers = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.papers)
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
          Fetching preprints...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <AlertCircle className="w-12 h-12 text-ink-400 dark:text-ink-500" />
        <p className="font-serif text-lg text-ink-600 dark:text-ink-400 text-center">
          Couldn't fetch preprints.
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
      {papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="font-serif text-lg text-ink-500 dark:text-ink-400 text-center">
            No preprints found for this topic.
          </p>
          <p className="font-sans text-sm text-ink-400 dark:text-ink-500 text-center">
            Try selecting a different category in{' '}
            <button onClick={onOpenSettings} className="underline hover:text-ink-700 dark:hover:text-ink-300">
              Settings
            </button>.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper, index) => (
            <BiorxivCard
              key={`${paper.id}-${index}`}
              paper={paper}
              index={index}
              isBookmarked={isPreprintBookmarked(paper.id)}
              onToggleBookmark={onTogglePreprintBookmark}
            />
          ))}
        </div>
      )}

      <div 
        ref={loadMoreRef} 
        className="w-full py-12 flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-ink-400 dark:text-ink-500 animate-spin" />
            <span className="font-sans text-sm text-ink-500 dark:text-ink-400">
              Loading more preprints...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
