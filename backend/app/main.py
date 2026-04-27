from fastapi import FastAPI


app = FastAPI(title="Reposage")

@app.get("/")
def root():
    return {"message": "Reposage is alive!"}



