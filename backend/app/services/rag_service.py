import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from app.services.github_service import get_repo_tree, get_file_content
import ast
import shutil
import gc


CHUNK_SIZE = 50
CHUNK_OVERLAP = 10

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def get_python_chunks(path: str, content: str) -> list[Document]:
    try:
        tree = ast.parse(content)
    except SyntaxError:
        return []
    
    lines = content.split("\n")
    chunks = []
    
    # Track lines belonging to functions or classes
    function_lines = set()
    
    for node in ast.iter_child_nodes(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            start = node.lineno - 1
            end = getattr(node, "end_lineno", node.lineno)
            
            # Track these lines as part of a function/class
            for l in range(start, end):
                function_lines.add(l)
                
            chunk_text = "\n".join(lines[start:end])
            
            doc = Document(
                page_content=chunk_text,
                metadata={
                    "file_path": path,
                    "start_line": node.lineno,
                    "end_line": end,
                    "name": node.name
                }
            )
            chunks.append(doc)
            
    # Extract global/module-level scope lines (configs, variables, imports)
    total_lines = len(lines)
    global_lines_list = [i for i in range(total_lines) if i not in function_lines]
    
    # Group consecutive global lines together
    from itertools import groupby
    from operator import itemgetter
    
    for k, g in groupby(enumerate(global_lines_list), lambda ix: ix[0] - ix[1]):
        group = list(map(itemgetter(1), g))
        if len(group) > 0:
            chunk_lines = [lines[idx] for idx in group]
            # Strip empty lines from chunk start/end
            chunk_text = "\n".join(chunk_lines).strip()
            if chunk_text:
                doc = Document(
                    page_content=chunk_text,
                    metadata={
                        "file_path": path,
                        "start_line": group[0] + 1,
                        "end_line": group[-1] + 1,
                        "name": "global_scope"
                    }
                )
                chunks.append(doc)
    
    return chunks


def line_based_chunks(path: str, content: str) -> list[Document]:
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

def chunk_file(path: str, content: str) -> list[Document]:
    if path.endswith(".py"):
        py_chunks = get_python_chunks(path, content)
        if py_chunks:
            return py_chunks
    
    return line_based_chunks(path, content)


def index_repository(owner: str, repo: str) -> str:
    persist_dir = f"./chromadb/{owner}_{repo}"
    
    if os.path.exists(persist_dir):
        gc.collect()  # ChromaDB connections release karo
        shutil.rmtree(persist_dir, ignore_errors=True)
    
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
        persist_directory=persist_dir
    )
    
    return f"Indexed {len(all_chunks)} chunks"

def search_code(owner: str, repo: str, query: str) -> list:
    vectorstore = Chroma(
        persist_directory=f"./chromadb/{owner}_{repo}",
        embedding_function=embeddings
    )

    # Fetch a wider pool of results to perform reciprocal re-ranking
    results = vectorstore.similarity_search_with_score(query, k=15)
    vectorstore._client.close()

    # Tokenize the query for strict keyword matching overlap
    query_words = set(query.lower().split())
    stop_words = {"where", "is", "the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "with", "of", "route", "endpoint", "method"}
    important_query_words = {w for w in query_words if w not in stop_words and len(w) > 1}
    
    hybrid_results = []
    for doc, distance in results:
        content_lower = doc.page_content.lower()
        file_path_lower = doc.metadata.get("file_path", "").lower()
        
        # Calculate term overlap match score
        matched_words = 0
        if important_query_words:
            for word in important_query_words:
                if word in content_lower or word in file_path_lower:
                    matched_words += 1
            keyword_score = matched_words / len(important_query_words)
        else:
            keyword_score = 0
            
        # Convert Chroma distance to similarity (0 distance = 1.0 similarity)
        vector_sim = 1.0 / (1.0 + distance)
        
        # Combined score: 60% keyword match overlap, 40% semantic vector match
        hybrid_score = 0.4 * vector_sim + 0.6 * keyword_score
        
        hybrid_results.append((doc, hybrid_score))
        
    # Re-rank results by combined hybrid score
    hybrid_results.sort(key=lambda x: x[1], reverse=True)

    seen = set()
    unique_results = []
    for doc, score in hybrid_results:
        cleaned_content = doc.page_content.strip()
        if cleaned_content not in seen:
            seen.add(cleaned_content)
            unique_results.append(doc)

    return unique_results[:3]