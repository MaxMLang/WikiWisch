import { useEffect, useRef, useCallback } from 'react'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import ArticleCard from './ArticleCard'

export default function Feed({ 
  articles, 
  isLoading, 
  isFetchingNextPage, 
  hasNextPage, 
  fetchNextPage,
  error,
  refetch,
  isBookmarked,
  onToggleBookmark 
}) {
  const loadMoreRef = useRef(null)

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
      rootMargin: '400px', // Start loading before reaching the end
      threshold: 0,
    })

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [handleObserver])

  // Initial loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-ink-200 dark:border-ink-700 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-ink-900 dark:border-t-ink-100 rounded-full animate-spin" />
        </div>
        <p className="font-serif text-lg text-ink-500 dark:text-ink-400 animate-pulse-subtle">
          Discovering knowledge...
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
          Something went wrong while fetching articles.
        </p>
        <button
          onClick={() => refetch()}
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

  // Empty state
  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <p className="font-serif text-xl text-ink-500 dark:text-ink-400 text-center">
          No articles to display.
        </p>
        <p className="font-sans text-sm text-ink-400 dark:text-ink-500 text-center">
          Try selecting some categories in settings.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Article Cards */}
      <div className="space-y-2">
        {articles.map((article, index) => (
          <ArticleCard
            key={`${article.pageid}-${index}`}
            article={article}
            index={index}
            isBookmarked={isBookmarked(article.pageid)}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>

      {/* Load More Trigger */}
      <div 
        ref={loadMoreRef} 
        className="w-full py-12 flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-ink-400 dark:text-ink-500 animate-spin" />
            <span className="font-sans text-sm text-ink-500 dark:text-ink-400">
              Loading more...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
