import { useEffect } from 'react'
import { CheckCircle, RefreshCw } from 'lucide-react'

export default function Toast({ isVisible, isLoading, message, onHide }) {
  useEffect(() => {
    if (isVisible && !isLoading) {
      const timer = setTimeout(() => {
        onHide()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, isLoading, onHide])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div 
        className="
          flex items-center gap-3 px-5 py-3
          bg-ink-900 dark:bg-ink-100
          text-white dark:text-ink-900
          rounded-full shadow-lg
          font-sans text-sm font-medium
        "
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Refreshing feed...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>{message || 'Feed refreshed!'}</span>
          </>
        )}
      </div>
    </div>
  )
}
