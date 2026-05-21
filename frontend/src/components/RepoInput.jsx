function RepoInput({ owner, setOwner, repo, setRepo, onIndex, loading, indexed, logs = [] }) {
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onIndex();
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: "600px", margin: "0 auto 2rem" }}>
      <h2 className="form-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: "var(--primary)"}}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
        Load GitHub Repository
      </h2>
      
      <div className="input-grid">
        <div className="input-wrapper">
          <input
            type="text"
            className="input-field"
            placeholder="Owner (e.g., facebook)"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        
        <div className="input-wrapper">
          <input
            type="text"
            className="input-field"
            placeholder="Repo (e.g., react)"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      </div>
      
      <button 
        className="btn btn-primary" 
        onClick={onIndex} 
        disabled={loading}
        style={{ width: "100%" }}
      >
        {loading ? (
          <>
            <div className="spinner"></div>
            <span>Indexing repository...</span>
          </>
        ) : indexed ? (
          "Re-Index Repository"
        ) : (
          "Index Repository"
        )}
      </button>

      {/* Terminal log panel */}
      {(loading || logs.length > 0) && (
        <div className="logs-container">
          {logs.map((log, index) => (
            <div key={index} className="log-line">
              <span className="log-time">[{new Date().toLocaleTimeString()}]</span>
              <span>{log}</span>
            </div>
          ))}
          {loading && (
            <div className="log-line" style={{color: "var(--text-muted)", animation: "fadeIn 0.5s infinite alternate"}}>
              <span>❯ Running operations...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RepoInput;