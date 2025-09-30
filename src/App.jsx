import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: input, completed: false, createdAt: new Date(), completedAt: null },
    ]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const completed = !task.completed;
          return {
            ...task,
            completed,
            completedAt: completed ? new Date() : null,
          };
        }
        return task;
      })
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Pending") return !task.completed;
    if (filter === "Completed") return task.completed;
  });

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString();
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <div className="app-container">
        <div className="top-header">
          <h1>To-Do List</h1>
          <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {}
        <div className="top-section">
          <div className="input-section">
            <input
              type="text"
              placeholder="Enter a task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button onClick={addTask}>Add</button>
          </div>

          <div className="filter-section">
            {["All", "Pending", "Completed"].map((f) => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {}
        <ul className="task-list">
          {filteredTasks.length === 0 && <p>No tasks here.</p>}
          {filteredTasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className={task.completed ? "completed" : ""}>
                  {task.text}
                </span>
                <small className="timestamp">
                  {task.completed
                    ? `Completed: ${formatDate(task.completedAt)}`
                    : `Created: ${formatDate(task.createdAt)}`}
                </small>
              </div>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                {"❌"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;