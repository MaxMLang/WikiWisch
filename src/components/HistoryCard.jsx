import { useState } from 'react'
import { 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink,
  Calendar,
  Star,
  Skull,
  History
} from 'lucide-react'

export default function HistoryCard({ event, isBookmarked, onToggleBookmark, index }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!event) return null

  const {
    year,
    text,
    type,
    title,
    description,
    thumbnail,
    wikiUrl,
  } = event

  // Get icon and color based on type
  const typeConfig = {
    event: { icon: History, color: 'purple', label: 'Event' },
    birth: { icon: Star, color: 'green', label: 'Born' },
    death: { icon: Skull, color: 'ink', label: 'Died' },
  }

  const { icon: TypeIcon, color, label } = typeConfig[type] || typeConfig.event

  const colorClasses = {
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    ink: 'bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-ink-300',
  }

  const animationDelay = `animation-delay-${(index % 5) * 100}`

  return (
    <article 
      className={`
        w-full max-w-2xl mx-auto mb-6
        bg-white dark:bg-ink-900
        border border-ink-200 dark:border-ink-800
        rounded-sm
        card-shadow
        opacity-0 animate-slide-up ${animationDelay}
        transition-all duration-300
      `}
    >
      <div className="flex gap-4 p-5 md:p-6">
        {/* Thumbnail */}
        {thumbnail && !imageError ? (
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded overflow-hidden bg-ink-100 dark:bg-ink-800">
            <img
              src={thumbnail}
              alt={title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`
                w-full h-full object-cover
                transition-opacity duration-500
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
            />
          </div>
        ) : (
          <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-ink-300 dark:text-ink-600" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badge & Year */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 text-xs font-sans font-semibold rounded flex items-center gap-1 ${colorClasses[color]}`}>
              <TypeIcon className="w-3 h-3" />
              {label}
            </span>
            <span className="text-sm font-mono font-semibold text-ink-900 dark:text-ink-100">
              {year}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg md:text-xl font-semibold text-ink-900 dark:text-ink-50 leading-tight mb-1">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mb-2">
              {description}
            </p>
          )}

          {/* Event text */}
          <p className="font-sans text-sm text-ink-600 dark:text-ink-400 line-clamp-2">
            {text}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => onToggleBookmark(event)}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              className={`
                p-1.5 rounded-full transition-all duration-200
                ${isBookmarked 
                  ? 'bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900' 
                  : 'hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 dark:text-ink-400'
                }
              `}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {wikiUrl && (
              <a
                href={wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center gap-1 px-3 py-1.5
                  text-xs font-sans font-medium
                  text-ink-600 dark:text-ink-400
                  border border-ink-200 dark:border-ink-700
                  rounded-full
                  hover:border-ink-400 dark:hover:border-ink-500
                  transition-colors
                "
              >
                Wikipedia
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
