import { AlertCircle, RefreshCw, Calendar } from 'lucide-react'
import { useHistoryScraper } from '../hooks/useHistoryScraper'
import HistoryCard from './HistoryCard'

export default function HistoryFeed({ 
  isHistoryBookmarked,
  onToggleHistoryBookmark,
  showToast
}) {
  const {
    data: events,
    isLoading,
    error,
    refetch,
  } = useHistoryScraper()

  const handleRefresh = async () => {
    showToast(true)
    await refetch()
    showToast(false)
  }

  // Get today's date formatted
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-ink-200 dark:border-ink-700 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-ink-900 dark:border-t-ink-100 rounded-full animate-spin" />
        </div>
        <p className="font-serif text-lg text-ink-500 dark:text-ink-400 animate-pulse-subtle">
          Traveling through time...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <AlertCircle className="w-12 h-12 text-ink-400 dark:text-ink-500" />
        <p className="font-serif text-lg text-ink-600 dark:text-ink-400 text-center">
          Couldn't fetch historical events.
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
      {/* Today's Date Header */}
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-900/30">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
          <Calendar className="w-5 h-5" />
          <span className="font-serif text-lg font-semibold">On This Day: {today}</span>
        </div>
        <p className="mt-1 text-sm text-purple-600 dark:text-purple-400/80 font-sans">
          Events, births, and deaths that happened on this date throughout history
        </p>
      </div>

      {/* Events */}
      <div className="space-y-2">
        {events?.map((event, index) => (
          <HistoryCard
            key={event.id}
            event={event}
            index={index}
            isBookmarked={isHistoryBookmarked(event.id)}
            onToggleBookmark={onToggleHistoryBookmark}
          />
        ))}
      </div>

      {(!events || events.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="font-serif text-lg text-ink-500 dark:text-ink-400 text-center">
            No events found for today.
          </p>
        </div>
      )}
    </div>
  )
}
