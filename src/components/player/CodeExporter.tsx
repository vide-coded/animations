/**
 * Code Exporter Modal Component
 * Export animations in multiple formats with syntax highlighting
 */

import { Check, Copy, Download, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils/cn'
import { generateCode } from '../../lib/utils/code-generator'
import type { Animation, AnimationContext, AnimationMetadata } from '../../types/animation'

interface CodeExporterProps {
  animation: Animation
  metadata: AnimationMetadata
  context: AnimationContext
  isOpen: boolean
  onClose: () => void
}

export function CodeExporter({ animation, metadata, context, isOpen, onClose }: CodeExporterProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'react' | 'vanilla'>('html')
  const [copied, setCopied] = useState(false)
  const [includeComments, setIncludeComments] = useState(true)

  if (!isOpen) return null

  const { code, filename } = generateCode(animation, metadata, context, {
    format: activeTab,
    includeComments,
  })

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 rounded-lg shadow-2xl border border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold text-white">Export Animation</h2>
            <p className="text-sm text-zinc-400 mt-1">{metadata.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeTab === 'html'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            )}
          >
            Standalone HTML
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('react')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeTab === 'react'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            )}
          >
            React Component
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vanilla')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeTab === 'vanilla'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            )}
          >
            Vanilla JS
          </button>

          <div className="flex-1" />

          {/* Options */}
          <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={includeComments}
              onChange={(e) => setIncludeComments(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-0"
            />
            <span>Include comments</span>
          </label>
        </div>

        {/* Code Display */}
        <div className="flex-1 overflow-auto p-6 bg-zinc-950">
          <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
          <div className="text-sm text-zinc-500">
            File: <span className="text-zinc-300 font-mono">{filename}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
