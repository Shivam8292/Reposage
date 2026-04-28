function ResultCard({ result }) {
  return (
    <div style={{ border: "1px solid #444", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
      <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
        📄 {result.file_path} — Lines {result.start_line} to {result.end_line}
      </p>
      <pre style={{ background: "#1a1a1a", padding: "0.75rem", borderRadius: "4px", overflowX: "auto", fontSize: "0.8rem" }}>
        {result.content}
      </pre>
    </div>
  )
}

export default ResultCard