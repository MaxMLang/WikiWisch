import { useState } from 'react'
import { 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink,
  Palette,
  Share2
} from 'lucide-react'

export default function ArtCard({ artwork, isBookmarked, onToggleBookmark, index }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!artwork) return null

  const {
    title,
    artist,
    date,
    medium,
    department,
    imageUrl,
    detailUrl,
  } = artwork

  const handleShare = async () => {
    const shareText = `${detailUrl} — found this Wischer on wikiwisch.vercel.app`
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Found this Wischer on wikiwisch.vercel.app`,
          url: detailUrl,
        })
      } catch (e) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText)
    }
  }

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
      {/* Image */}
      {imageUrl && !imageError && (
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-ink-100 dark:bg-ink-800">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`
              w-full h-full object-contain bg-ink-50 dark:bg-ink-900
              transition-opacity duration-500
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-ink-300 dark:border-ink-600 border-t-ink-600 dark:border-t-ink-300 rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-sans font-semibold rounded flex items-center gap-1">
            <Palette className="w-3 h-3" />
            Art Institute of Chicago
          </span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ink-900 dark:text-ink-50 leading-tight mb-2">
          {title}
        </h2>

        {/* Artist & Date */}
        <p className="font-sans text-base text-ink-600 dark:text-ink-400 mb-4">
          {artist}
          {date && <span className="text-ink-400 dark:text-ink-500"> · {date}</span>}
        </p>

        {/* Medium */}
        {medium && (
          <p className="font-sans text-sm text-ink-500 dark:text-ink-400 mb-2">
            {medium}
          </p>
        )}

        {/* Department */}
        {department && (
          <p className="font-sans text-xs text-ink-400 dark:text-ink-500">
            {department}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 md:px-8 py-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(artwork)}
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
          <button
            onClick={handleShare}
            aria-label="Share artwork"
            className="p-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <a
          href={detailUrl}
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
          View at Museum
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* License */}
      <div className="px-6 md:px-8 pb-4">
        <p className="text-xs text-ink-400 dark:text-ink-600 font-sans">
          Public domain · Art Institute of Chicago
        </p>
      </div>
    </article>
  )
}
