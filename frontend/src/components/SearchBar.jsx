function SearchBar({ query, setQuery, onSearch, loading }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <input
        type="text"
        placeholder="Search (e.g. how is authentication handled?)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginRight: "0.5rem", padding: "0.5rem", width: "400px" }}
      />
      <button onClick={onSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  )
}

export default SearchBar