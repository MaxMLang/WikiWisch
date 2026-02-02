import { useState } from 'react'
import { 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Share2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function ArticleCard({ article, isBookmarked, onToggleBookmark, index }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!article) return null

  const {
    title,
    extract,
    thumbnail,
    content_urls,
    description,
  } = article

  const wikiUrl = content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
  
  // Truncate extract for collapsed view
  const shortExtract = extract?.length > 300 
    ? extract.slice(0, 300).trim() + '...' 
    : extract

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || shortExtract,
          url: wikiUrl,
        })
      } catch (e) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(wikiUrl)
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
      {/* Hero Image */}
      {thumbnail && !imageError && (
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-ink-100 dark:bg-ink-800">
          <img
            src={thumbnail.source}
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-ink-300 dark:border-ink-600 border-t-ink-600 dark:border-t-ink-300 rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Category/Description */}
        {description && (
          <p className="text-xs uppercase tracking-widest text-ink-500 dark:text-ink-400 mb-3 font-sans font-medium">
            {description}
          </p>
        )}

        {/* Title */}
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-ink-50 leading-tight mb-4 text-balance">
          {title}
        </h2>

        {/* Extract/Summary */}
        <div className="prose prose-ink dark:prose-invert max-w-none">
          <p className="font-serif text-lg md:text-xl text-ink-700 dark:text-ink-300 leading-relaxed">
            {isExpanded ? extract : shortExtract}
          </p>
        </div>

        {/* Expand/Collapse */}
        {extract?.length > 300 && (
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
      </div>

      {/* Footer */}
      <div className="px-6 md:px-8 py-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(article)}
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
            aria-label="Share article"
            className="p-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Wikipedia Link */}
        <a
          href={wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-2 px-4 py-2
            text-sm font-sans font-medium
            text-ink-600 dark:text-ink-400
            hover:text-ink-900 dark:hover:text-ink-100
            border border-ink-200 dark:border-ink-700
            rounded-full
            hover:border-ink-400 dark:hover:border-ink-500
            transition-all
          "
        >
          Read on Wikipedia
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* License Notice */}
      <div className="px-6 md:px-8 pb-4">
        <p className="text-xs text-ink-400 dark:text-ink-600 font-sans">
          Content from Wikipedia, available under{' '}
          <a 
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink-600 dark:hover:text-ink-400"
          >
            CC BY-SA 3.0
          </a>
        </p>
      </div>
    </article>
  )
}
