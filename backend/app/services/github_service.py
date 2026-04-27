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

def get_file_content(owner: str, repo: str, path: str) -> str:
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    response = requests.get(url, headers=HEADERS)
    data = response.json()
    
    content = base64.b64decode(data["content"]).decode("utf-8")
    return content