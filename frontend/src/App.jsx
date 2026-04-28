import { useState } from "react"
import RepoInput from "./components/RepoInput"
import SearchBar from "./components/SearchBar"
import ResultCard from "./components/ResultCard"

function App() {
  const [owner, setOwner] = useState("")
  const [repo, setRepo] = useState("")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [indexed, setIndexed] = useState(false)

  async function handleIndex() {
    setLoading(true)
    const res = await fetch("http://localhost:8000/index", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, repo }),
    })
    const data = await res.json()
    console.log(data)
    setIndexed(true)
    setLoading(false)
  }

  async function handleSearch() {
    setLoading(true)
    const res = await fetch("http://localhost:8000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, repo, query }),
    })
    const data = await res.json()
    console.log(data)
    setResults(data.results || [])
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Reposage 🔍</h1>
      <RepoInput
        owner={owner} setOwner={setOwner}
        repo={repo} setRepo={setRepo}
        onIndex={handleIndex}
        loading={loading}
        indexed={indexed}
      />
      {indexed && (
        <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} loading={loading} />
      )}
      <div style={{ marginTop: "1rem" }}>
        {results.map((r, i) => <ResultCard key={i} result={r} />)}
      </div>
    </div>
  )
}

export default App