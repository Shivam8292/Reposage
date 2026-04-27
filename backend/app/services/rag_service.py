import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from app.services.github_service import get_repo_tree, get_file_content

CHUNK_SIZE = 50
CHUNK_OVERLAP = 10

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def chunk_file(path: str, content: str) -> list[Document]:
    lines = content.split("\n")
    chunks = []
    
    i = 0
    while i < len(lines):
        chunk_lines = lines[i:i + CHUNK_SIZE]
        chunk_text = "\n".join(chunk_lines)
        start_line = i + 1
        end_line = i + len(chunk_lines)
        
        doc = Document(
            page_content=chunk_text,
            metadata={
                "file_path": path,
                "start_line": start_line,
                "end_line": end_line
            }
        )
        chunks.append(doc)
        i += CHUNK_SIZE - CHUNK_OVERLAP
    
    return chunks

def index_repository(owner: str, repo: str) -> str:
    files = get_repo_tree(owner, repo)
    
    all_chunks = []
    for file in files[:50]:  # pehle 50 files test ke liye
        try:
            content = get_file_content(owner, repo, file["path"])
            chunks = chunk_file(file["path"], content)
            all_chunks.extend(chunks)
        except Exception:
            continue
    
    vectorstore = Chroma.from_documents(
        documents=all_chunks,
        embedding=embeddings,
        persist_directory=f"./chromadb/{owner}_{repo}"
    )
    
    return f"Indexed {len(all_chunks)} chunks"

def search_code(owner: str, repo: str, query: str) -> list:
    vectorstore = Chroma(
        persist_directory=f"./chromadb/{owner}_{repo}",
        embedding_function=embeddings
    )
    
    results = vectorstore.similarity_search(query, k=5)
    return results