import { useState } from "react";

function ResultCard({ result, owner, repo }) {
  const [copied, setCopied] = useState(false);

  // Copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate GitHub link directly to the line range
  const githubLink = `https://github.com/${owner}/${repo}/blob/main/${result.file_path}#L${result.start_line}-L${result.end_line}`;

  // Split code content to render line numbers dynamically
  const codeLines = result.content.split("\n");

  return (
    <div className="result-card">
      <div className="result-header">
        <div className="file-info">
          {/* File Icon SVG */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span className="file-path">{result.file_path}</span>
          <span className="file-lines">• Lines {result.start_line} to {result.end_line}</span>
        </div>

        <div className="card-actions">
          {/* GitHub link */}
          <a href={githubLink} target="_blank" rel="noopener noreferrer" className="action-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>GitHub</span>
          </a>

          {/* Copy Button */}
          <button className="btn-icon-only" onClick={handleCopy} title="Copy code">
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="code-container">
        {/* Dynamic line numbers */}
        <div className="line-numbers">
          {codeLines.map((_, i) => (
            <div key={i}>{result.start_line + i}</div>
          ))}
        </div>

        {/* Code body */}
        <pre className="code-content">
          <code>{result.content}</code>
        </pre>
      </div>
    </div>
  );
}

export default ResultCard;