import { useState } from 'react'
import 'prismjs/themes/prism-tomorrow.css'
import Editor from 'react-simple-code-editor'
import prism from 'prismjs'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum(a, b) {
  return a + b
}`)
  const [review, setReview] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function reviewCode() {
    if (!code.trim()) {
      setError('Paste or type some code to review.')
      return
    }
    setIsLoading(true)
    setError('')
    setReview('')
    try {
      const response = await axios.post('/ai/get-review', { code }, { timeout: 65000 })
      setReview(response.data.review)
    } catch (requestError) {
      setError(requestError.response?.data?.error || (requestError.code === 'ECONNABORTED' ? 'The review took too long. Try a smaller code sample or retry in a moment.' : 'Could not reach the review service. Make sure the backend is running.'))
    } finally {
      setIsLoading(false)
    }
  }

  function clearEditor() {
    setCode('')
    setReview('')
    setError('')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Codewise home"><span className="brand-mark">&lt;/&gt;</span> codewise</a>
        <span className="topbar-note"><span className="status-dot" /> AI code review</span>
      </header>
      <main id="top">
        <section className="panel editor-panel">
          <div className="panel-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Review your code</h1></div><span className="language-chip">JavaScript</span></div>
          <div className="code">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={value => prism.highlight(value, prism.languages.javascript, 'javascript')}
              padding={18}
              textareaId="code-editor"
              textareaClassName="code-input"
              preClassName="code-highlight"
              style={{ fontFamily: '"SFMono-Regular", Consolas, monospace', fontSize: 14, lineHeight: 1.7, minHeight: '100%', width: '100%' }}
            />
          </div>
          <div className="editor-footer"><span>{code.split('\n').length} lines</span><div className="editor-actions"><button onClick={clearEditor} className="clear-button" disabled={isLoading}>Clear editor</button><button onClick={reviewCode} className="review-button" disabled={isLoading}>{isLoading ? <><span className="spinner" /> Reviewing…</> : <><span>✦</span> Review code</>}</button></div></div>
        </section>
        <section className="panel result-panel" aria-live="polite">
          <div className="panel-heading"><div><p className="eyebrow">INSIGHTS</p><h2>Code review</h2></div><span className="sparkle">✦</span></div>
          {error ? <div className="message error-message"><span>!</span><p>{error}</p></div> : review ? <div className="review-content"><Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown></div> : <div className="empty-state"><div className="empty-icon">✧</div><h3>Ready when you are</h3><p>Your review will appear here with clear feedback on bugs, security, performance, and readability.</p><div className="review-points"><span>⌕ &nbsp;Potential issues</span><span>↗ &nbsp;Improvement ideas</span><span>✓ &nbsp;Best practices</span></div></div>}
        </section>
      </main>
    </div>
  )
}

export default App
