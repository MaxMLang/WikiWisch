import { useState } from 'react'
import { 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Calendar,
  Sparkles
} from 'lucide-react'

export default function NasaCard({ entry, isBookmarked, onToggleBookmark, index }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!entry) return null

  const {
    title,
    explanation,
    date,
    mediaType,
    url,
    hdUrl,
    copyright,
  } = entry

  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Truncate explanation
  const shortExplanation = explanation?.length > 300 
    ? explanation.slice(0, 300).trim() + '...' 
    : explanation

  const animationDelay = `animation-delay-${(index % 5) * 100}`

  return (
    <article 
      className={`
        w-full max-w-2xl mx-auto mb-8
        bg-white dark:bg-ink-900
        border border-ink-200 dark:border-ink-800
        rounded-sm
        card-shadow
        opacity-0 animate-slide-up ${animationDelay}
        transition-all duration-300
      `}
    >
      {/* Media */}
      {mediaType === 'image' && url && !imageError ? (
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-ink-900">
          <img
            src={url}
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
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink-900">
              <div className="w-8 h-8 border-2 border-ink-600 border-t-ink-300 rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : mediaType === 'video' ? (
        <div className="relative w-full aspect-video bg-ink-900">
          <iframe
            src={url}
            title={title}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      ) : null}

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Badge & Date */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-sans font-semibold rounded flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            NASA APOD
          </span>
          <div className="flex items-center gap-1.5 text-xs text-ink-400 dark:text-ink-500">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ink-900 dark:text-ink-50 leading-tight mb-4">
          {title}
        </h2>

        {/* Explanation */}
        <p className="font-sans text-base text-ink-700 dark:text-ink-300 leading-relaxed">
          {isExpanded ? explanation : shortExplanation}
        </p>

        {/* Expand/Collapse */}
        {explanation?.length > 300 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="
              flex items-center gap-1 mt-4
              text-sm font-sans font-medium
              text-ink-500 dark:text-ink-400
              hover:text-ink-900 dark:hover:text-ink-100
              transition-colors
            "
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}

        {/* Copyright */}
        {copyright && (
          <p className="mt-4 text-xs text-ink-400 dark:text-ink-500">
            © {copyright}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 md:px-8 py-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
        <button
          onClick={() => onToggleBookmark(entry)}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          className={`
            p-2 rounded-full transition-all duration-200
            ${isBookmarked 
              ? 'bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900' 
              : 'hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400'
            }
          `}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>

        {hdUrl && (
          <a
            href={hdUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2 px-4 py-2
              text-sm font-sans font-medium
              text-white dark:text-ink-900
              bg-ink-900 dark:bg-ink-100
              rounded-full
              hover:bg-ink-700 dark:hover:bg-ink-300
              transition-all
            "
          >
            View HD
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Credit */}
      <div className="px-6 md:px-8 pb-4">
        <p className="text-xs text-ink-400 dark:text-ink-600 font-sans">
          NASA Astronomy Picture of the Day
        </p>
      </div>
    </article>
  )
}
