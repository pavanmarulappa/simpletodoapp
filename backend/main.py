from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
#import models
#import database
from backend import models, database


models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production: restrict to your frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/todos")
def get_todos(db: Session = Depends(get_db)):
    todos = db.query(models.Todo).all()
    return {"todos": [{"id": t.id, "text": t.text} for t in todos]}

@app.post("/api/todos")
def add_todo(item: dict, db: Session = Depends(get_db)):
    if not item.get("text"):
        raise HTTPException(status_code=400, detail="Missing text")
    todo = models.Todo(text=item["text"])
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return {"message": "Todo added", "todo": {"id": todo.id, "text": todo.text}}

@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
    return {"message": "Deleted successfully"}

