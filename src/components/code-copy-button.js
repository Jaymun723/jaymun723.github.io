import React, { useEffect } from 'react'
import { FaCopy, FaCheck } from 'react-icons/fa'
import { createRoot } from 'react-dom/client'

const CopyButton = ({ content }) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="code-copy-btn"
      aria-label="Copy code"
      style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        background: 'var(--color-card-bg)',
        border: '1px solid var(--color-accent)',
        borderRadius: '4px',
        padding: '0.25rem 0.5rem',
        cursor: 'pointer',
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
        transition: 'opacity 0.2s',
        zIndex: 10
      }}
    >
      {copied ? <FaCheck size={14} color="green" /> : <FaCopy size={14} />}
    </button>
  )
}

const CodeBlockManager = () => {
  useEffect(() => {
    const addButtons = () => {
      // Target PrismJS pre tags
      const preTags = document.querySelectorAll('div.gatsby-highlight pre')
      
      preTags.forEach(pre => {
        const container = pre.parentElement
        if (!container || !container.classList.contains('gatsby-highlight')) return

        // Check if button already exists (check for the wrapper class)
        if (container.querySelector('.code-copy-button-wrapper')) return

        // Ensure container handles absolute positioning of button
        if (getComputedStyle(container).position === 'static') {
          container.style.position = 'relative'
        }
        
        // Create container for button
        const buttonContainer = document.createElement('div')
        buttonContainer.className = 'code-copy-button-wrapper'
        container.appendChild(buttonContainer)
        
        // Get content - for PrismJS we might want to exclude line numbers if they are in the DOM
        // But usually pre.innerText works well enough or we can target the code tag
        const codeElement = pre.querySelector('code')
        const content = codeElement ? codeElement.innerText : pre.innerText
        
        if (content) {
          const root = createRoot(buttonContainer)
          root.render(<CopyButton content={content} />)
        }
      })
    }

    // Run initially
    addButtons()

    // Observe for changes (e.g. hydration, client-side nav)
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          shouldUpdate = true
        }
      })
      if (shouldUpdate) {
        addButtons()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}

export default CodeBlockManager