function RepoInput({ owner, setOwner, repo, setRepo, onIndex, loading, indexed }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <input
        type="text"
        placeholder="Owner (e.g. facebook)"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        style={{ marginRight: "0.5rem", padding: "0.5rem" }}
      />
      <input
        type="text"
        placeholder="Repo (e.g. react)"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        style={{ marginRight: "0.5rem", padding: "0.5rem" }}
      />
      <button onClick={onIndex} disabled={loading}>
        {loading ? "Indexing..." : indexed ? "Re-Index" : "Index Repo"}
      </button>
    </div>
  )
}

export default RepoInput