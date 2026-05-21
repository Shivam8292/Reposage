import { useState, useEffect } from "react"
import RepoInput from "./components/RepoInput"
import SearchBar from "./components/SearchBar"
import ResultCard from "./components/ResultCard"

function App() {
  // Load initial states from localStorage if available
  const [owner, setOwner] = useState(() => localStorage.getItem("reposage_owner") || "")
  const [repo, setRepo] = useState(() => localStorage.getItem("reposage_repo") || "")
  const [indexed, setIndexed] = useState(() => localStorage.getItem("reposage_indexed") === "true")
  
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [logs, setLogs] = useState([])

  // Persist settings in localStorage
  useEffect(() => {
    localStorage.setItem("reposage_owner", owner)
    localStorage.setItem("reposage_repo", repo)
    localStorage.setItem("reposage_indexed", indexed)
  }, [owner, repo, indexed])

  // Clear indexing state to select another repo
  function handleReset() {
    setIndexed(false)
    setResults([])
    setQuery("")
    setError("")
    setLogs([])
  }

  // Clear search results and query
  function handleClearSearch() {
    setQuery("")
    setResults([])
    setError("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle repository indexing
  async function handleIndex() {
    if (!owner.trim() || !repo.trim()) {
      setError("Please fill out both Owner and Repo fields.")
      return
    }

    setLoading(true)
    setError("")
    setLogs([])

    // Simulated log feed to provide a beautiful indexing experience
    const simulatedLogs = [
      "Connecting to backend server...",
      `Pinging GitHub API for repo: ${owner}/${repo}...`,
      "Fetching repository directory tree...",
      "Analyzing files and filtering supported formats (.py, .js, .jsx, etc.)...",
      "Parsing Python AST nodes for structural analysis...",
      "Splitting files into semantic text blocks...",
      "Initiating local Sentence-Transformers model...",
      "Embedding 50+ document chunks to vector space...",
      "Connecting to Chroma Vector Database...",
      "Upserting embeddings to database indexes...",
      "Persisting metadata and files..."
    ]

    let currentLogIndex = 0
    const logInterval = setInterval(() => {
      if (currentLogIndex < simulatedLogs.length) {
        setLogs(prev => [...prev, simulatedLogs[currentLogIndex]])
        currentLogIndex++
      } else {
        clearInterval(logInterval)
      }
    }, 450)

    try {
      const res = await fetch("http://localhost:8000/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      })
      const data = await res.json()
      
      clearInterval(logInterval)

      if (data.error) {
        setError(data.error)
        setLogs(prev => [...prev, `[ERROR] ${data.error}`])
        setIndexed(false)
      } else {
        setLogs(prev => [...prev, `[SUCCESS] ${data.message || "Repository successfully indexed!"}`])
        setIndexed(true)
      }
    } catch (err) {
      clearInterval(logInterval)
      setError("Failed to connect to backend server. Make sure uvicorn is running on port 8000.")
      setLogs(prev => [...prev, "[ERROR] Backend server connection refused."])
      setIndexed(false)
    } finally {
      setLoading(false)
    }
  }

  // Handle code search query
  async function handleSearch(searchQuery = query) {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, query: searchQuery }),
      })
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setResults(data.results || [])
      }
    } catch (err) {
      setError("Failed to fetch search results from backend server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <h1 className="logo-title">Reposage<span>.</span></h1>
        </div>
        <p className="subtitle">Explore codebases semantically. Index public repositories and ask questions using natural language.</p>
      </header>

      {error && (
        <div className="error-toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {indexed ? (
        <>
          <div className="repo-info-banner">
            <div className="repo-details">
              <div className="repo-avatar">{owner.charAt(0).toUpperCase()}</div>
              <div className="repo-name-text">
                <span>{owner}</span> / {repo}
              </div>
            </div>
            <button className="btn btn-secondary btn-danger" onClick={handleReset}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "0.25rem"}}>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Change Repository
            </button>
          </div>

          <SearchBar 
            query={query} 
            setQuery={setQuery} 
            onSearch={handleSearch} 
            loading={loading} 
            onClear={handleClearSearch}
            hasResults={results.length > 0}
          />

          <div style={{ marginTop: "1rem" }}>
            {results.length > 0 ? (
              results.map((r, i) => (
                <ResultCard key={i} result={r} owner={owner} repo={repo} query={query} />
              ))
            ) : (
              !loading && query && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <p>No matches found in codebase. Try describing your search differently.</p>
                </div>
              )
            )}
          </div>

          {results.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem", marginBottom: "3.5rem", animation: "fadeIn 0.5s ease" }}>
              <button className="btn btn-secondary" onClick={handleClearSearch}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.5rem" }}>
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                </svg>
                New Search
              </button>
            </div>
          )}
        </>
      ) : (
        <RepoInput
          owner={owner} setOwner={setOwner}
          repo={repo} setRepo={setRepo}
          onIndex={handleIndex}
          loading={loading}
          indexed={indexed}
          logs={logs}
        />
      )}
    </div>
  )
}

export default App