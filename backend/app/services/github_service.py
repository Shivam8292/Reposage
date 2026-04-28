import requests
import base64
import os
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

def get_repo_tree(owner: str, repo: str) -> list:
    url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/HEAD?recursive=1"
    response = requests.get(url, headers=HEADERS)
    data = response.json()
    
    files = [
        item for item in data["tree"]
        if item["type"] == "blob"
    ]
    return files

def get_file_content(owner: str, repo: str, path: str) -> str | None:
    try:
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
        response = requests.get(url, headers=HEADERS)
        
        if response.status_code != 200:
            return None
            
        data = response.json()
        
        if data.get("encoding") != "base64":
            return None
            
        content = base64.b64decode(data["content"]).decode("utf-8")
        return content
    except Exception:
        return None