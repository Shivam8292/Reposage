# Reposage 🔍

> Navigate any GitHub codebase with natural language — find the exact file and line numbers you need, instantly.

## What is Reposage?

When you join a new team or get handed a large codebase, finding *where* to make a change is half the battle. Reposage lets you describe what you're looking for in plain English and returns the exact code — file path, line numbers, and the relevant snippet.

**Example:**
- Query: *"where is the register endpoint defined"*
- Result: `backend/main.py — Lines 58 to 71` → the exact `def register(...)` function

No more grepping through files. No more reading code you don't care about.

---

## Features

- **Natural language search** — describe what you want, get the exact code back
- **Function-level precision** — Python files are chunked using AST, so results map to real function/class boundaries, not arbitrary line windows
- **Smart filtering** — only source code files are indexed (`.py`, `.js`, `.jsx`, `.ts`, `.tsx`, `.java`, `.cpp`, `.c`, `.go`, `.rs`)
- **Re-indexing** — update the index any time with one click

---

## Tech Stack

**Backend**
- FastAPI
- LangChain
- ChromaDB (vector store)
- HuggingFace Embeddings (`all-MiniLM-L6-v2`)
- GitHub REST API
- Python `ast` module (function-level chunking)

**Frontend**
- React (Vite)

---

## How It Works

1. Enter a GitHub repo (owner + repo name) and click **Re-Index**
2. Reposage fetches all source files via the GitHub API
3. Python files are parsed with AST to extract exact function/class boundaries; other files use sliding window chunking
4. Code chunks are embedded using a HuggingFace sentence transformer and stored in ChromaDB
5. On search, your query is embedded and compared against stored chunks — top matches are returned with file path and line numbers

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- GitHub Personal Access Token

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```
GITHUB_TOKEN=your_github_token_here
```

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Project Structure

```
Reposage/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app, endpoints
│   │   └── services/
│   │       ├── github_service.py # GitHub API integration
│   │       └── rag_service.py    # Chunking, embedding, search
│   └── requirements.txt
└── frontend/
    └── src/
        └── components/
            ├── RepoInput.jsx
            ├── SearchBar.jsx
            └── ResultCard.jsx
```

---

## API

### `POST /index`
Index a GitHub repository.

```json
{ "owner": "Shivam8292", "repo": "Documind" }
```

### `POST /search`
Search indexed code with a natural language query.

```json
{ "owner": "Shivam8292", "repo": "Documind", "query": "where is authentication handled" }
```

---

## Limitations

- Only public GitHub repositories are supported
- Function-level chunking is currently Python-only; other languages use 50-line sliding window chunks
- First-time indexing may take 30–60 seconds depending on repo size
