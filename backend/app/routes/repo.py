from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag_service import index_repository, search_code

router = APIRouter()

class RepoRequest(BaseModel):
    owner: str
    repo: str

class SearchRequest(BaseModel):
    owner: str
    repo: str
    query: str

@router.post("/index")
def index_repo(request: RepoRequest):
    try:
        result = index_repository(request.owner, request.repo)
        return {"message": result}
    except Exception as e:
        return {"error": str(e)}

@router.post("/search")
def search_repo(request: SearchRequest):
    results = search_code(request.owner, request.repo, request.query)
    return {
        "results": [
            {
                "file_path": r.metadata["file_path"],
                "start_line": r.metadata["start_line"],
                "end_line": r.metadata["end_line"],
                "content": r.page_content
            }
            for r in results
        ]
    }