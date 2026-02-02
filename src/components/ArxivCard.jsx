import { useState } from 'react'
import { 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
  Users,
  Calendar,
  Share2
} from 'lucide-react'

export default function ArxivCard({ paper, isBookmarked, onToggleBookmark, index }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!paper) return null

  const {
    id,
    title,
    abstract,
    authors,
    categories,
    published,
    pdfLink,
    absLink,
  } = paper

  // Format date
  const publishedDate = new Date(published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // Truncate abstract
  const shortAbstract = abstract?.length > 300 
    ? abstract.slice(0, 300).trim() + '...' 
    : abstract

  // Format authors (show first 3, then "et al.")
  const displayAuthors = authors.length > 3 
    ? [...authors.slice(0, 3), `+${authors.length - 3} more`]
    : authors

  const handleShare = async () => {
    const shareText = `${absLink} — found this Wischer on wikiwisch.vercel.app`
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Found this Wischer on wikiwisch.vercel.app`,
          url: absLink,
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
      {/* Header with arXiv badge */}
      <div className="px-6 md:px-8 pt-6 pb-4 border-b border-ink-100 dark:border-ink-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-sans font-semibold rounded">
              arXiv
            </span>
            <span className="text-xs font-mono text-ink-400 dark:text-ink-500">
              {id}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink-400 dark:text-ink-500">
            <Calendar className="w-3.5 h-3.5" />
            {publishedDate}
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {categories.slice(0, 4).map((cat) => (
            <span 
              key={cat}
              className="px-2 py-0.5 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 text-xs font-sans rounded"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Title */}
        <h2 className="font-serif text-xl md:text-2xl font-semibold text-ink-900 dark:text-ink-50 leading-tight mb-4">
          {title}
        </h2>

        {/* Authors */}
        <div className="flex items-start gap-2 mb-4 text-sm text-ink-600 dark:text-ink-400">
          <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="font-sans">
            {displayAuthors.join(', ')}
          </p>
        </div>

        {/* Abstract */}
        <div className="prose prose-ink dark:prose-invert max-w-none">
          <p className="font-sans text-base text-ink-700 dark:text-ink-300 leading-relaxed">
            {isExpanded ? abstract : shortAbstract}
          </p>
        </div>

        {/* Expand/Collapse */}
        {abstract?.length > 300 && (
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
                Read full abstract <ChevronDown className="w-4 h-4" />
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
            onClick={() => onToggleBookmark(paper)}
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
            aria-label="Share paper"
            className="p-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2">
          <a
            href={pdfLink}
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
            <FileText className="w-4 h-4" />
            PDF
          </a>
          <a
            href={absLink}
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
            Read on arXiv
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* License Notice */}
      <div className="px-6 md:px-8 pb-4">
        <p className="text-xs text-ink-400 dark:text-ink-600 font-sans">
          arXiv papers are subject to individual author licenses
        </p>
      </div>
    </article>
  )
}
