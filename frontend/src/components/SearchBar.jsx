function SearchBar({ query, setQuery, onSearch, loading, onClear, hasResults }) {
  
  const suggestions = [
    "Where is the main application entry point?",
    "Show me how database connections are established",
    "Where are the API routes configured?",
    "How is GitHub data fetched or cloned?"
  ];

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleChipClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="glass-card">
      <h2 className="form-title" style={{ marginBottom: "1rem" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: "var(--secondary)"}}>
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        Semantic Search Codebase
      </h2>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <div className="input-wrapper" style={{ flex: 1 }}>
          <input
            type="text"
            className="input-field"
            placeholder="Describe what you want to find (e.g., 'jwt auth routing' or 'db setup')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => onSearch()} 
          disabled={loading || !query.trim()}
          style={{ padding: "0.75rem 2rem" }}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>Searching...</span>
            </>
          ) : (
            <span>Search</span>
          )}
        </button>

        {hasResults && (
          <button 
            className="btn btn-secondary" 
            onClick={onClear} 
            disabled={loading}
          >
            New Search
          </button>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="suggestions-container">
        <span className="suggestion-label">Suggestions:</span>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-chip"
            onClick={() => handleChipClick(suggestion)}
            disabled={loading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;