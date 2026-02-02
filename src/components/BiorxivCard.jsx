import { useState } from 'react'
import { Bookmark, BookmarkCheck, ExternalLink, FileText, ChevronDown, ChevronUp } from 'lucide-react'

export default function BiorxivCard({ paper, index, isBookmarked, onToggleBookmark }) {
  const [expanded, setExpanded] = useState(false)
  
  const formattedDate = paper.date 
    ? new Date(paper.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  const serverLabel = paper.server === 'medrxiv' ? 'medRxiv' : 'bioRxiv'
  const serverColor = paper.server === 'medrxiv' 
    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'

  return (
    <article
      className="group bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-lg overflow-hidden card-shadow animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-xs font-sans font-medium ${serverColor}`}>
              {serverLabel}
            </span>
            {paper.category && (
              <span className="px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 text-xs font-sans">
                {paper.category}
              </span>
            )}
          </div>
          <button
            onClick={() => onToggleBookmark(paper)}
            className={`p-2 rounded-full transition-colors flex-shrink-0 ${
              isBookmarked 
                ? 'text-ink-900 dark:text-ink-100 bg-ink-100 dark:bg-ink-800' 
                : 'text-ink-400 dark:text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-semibold text-ink-900 dark:text-ink-50 mb-2 leading-snug">
          {paper.title}
        </h3>

        {/* Authors */}
        {paper.authors && paper.authors.length > 0 && (
          <p className="font-sans text-sm text-ink-500 dark:text-ink-400 mb-3">
            {paper.authors.join(', ')}
            {paper.authors.length >= 5 && ' et al.'}
          </p>
        )}

        {/* Abstract */}
        {paper.abstract && (
          <div className="mb-4">
            <p className={`font-sans text-sm text-ink-600 dark:text-ink-300 leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
              {paper.abstract}
            </p>
            {paper.abstract.length > 200 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 flex items-center gap-1 font-sans text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
              >
                {expanded ? (
                  <>Show less <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Read more <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-ink-100 dark:border-ink-800">
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-xs text-ink-400 dark:text-ink-500">
              {formattedDate}
            </span>
            <span className="font-sans text-[10px] text-ink-300 dark:text-ink-600">
              Subject to author license
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={paper.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700 rounded-full hover:border-ink-400 dark:hover:border-ink-500 transition-colors"
            >
              <FileText className="w-3 h-3" />
              PDF
            </a>
            <a
              href={paper.absLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 rounded-full hover:bg-ink-700 dark:hover:bg-ink-300 transition-colors"
            >
              View
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
