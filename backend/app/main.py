from fastapi import FastAPI
from app.routes.repo import router



app = FastAPI(title="Reposage")

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Reposage is alive!"}



