from fastapi import FastAPI
from app.routes.repo import router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="Reposage")

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Reposage is alive!"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite ka default port
    allow_methods=["*"],
    allow_headers=["*"],
)



