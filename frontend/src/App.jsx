import { useState, useEffect } from "react"

// Update this to match your backend's public URL
const API_URL = "/api"; // For EC2, use: https://your-domain.com

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/todos`)
      const data = await res.json()
      setTodos(data.todos)
    } catch (err) {
      setError("Failed to load todos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async () => {
    if (!newTodo.trim()) return
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo }),
      })
      const data = await res.json()
      if (data.todo) {
        setTodos([...todos, data.todo])
      }
      setNewTodo("")
    } catch (err) {
      setError("Failed to add todo")
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" })
      setTodos(todos.filter((t) => t.id !== id))
    } catch (err) {
      setError("Failed to delete todo")
    }
  }

  return (
    <div className="container">
      <h1>✅ Simple To Do App </h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter a todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {todos.length === 0 && !loading && <p>No todos yet!</p>}
        {todos.map((t) => (
          <li key={t.id}>
            <span>{t.text}</span>
            <button className="delete" onClick={() => deleteTodo(t.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App

