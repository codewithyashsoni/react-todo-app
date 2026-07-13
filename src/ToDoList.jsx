import React, {useState , useEffect} from "react"

function ToDoList(){
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");
        if(savedTasks){
            return JSON.parse(savedTasks);
        }
        return []
    });
    const [newTask, setNewTask] = useState("");
    const [editingIndex,setEditingIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if(savedTheme){
            return JSON.parse(savedTheme);
        }
        return true;
    });
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        document.body.className = isDarkMode ? "" : "light-theme";
        localStorage.setItem("theme", JSON.stringify(isDarkMode));
    }, [isDarkMode])

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks])

    function addTask(){
        if(newTask.trim() === ""){
            return
        }
        const currentTask = {
            id: Date.now(),
            text: newTask,
            completed: false
        }
        setTasks(t => [...t, currentTask]);
        setNewTask("");
    }
    function handleDoubleClick(index){
        setEditingIndex(index);
        setEditText(tasks[index].text);
    }
    function saveEdit(){
        if(editingIndex === null) return;

        if(editText.trim() === ""){
            cancelEdit();
            return;
        }

        const updatedTasks = [...tasks];
        updatedTasks[editingIndex].text = editText;
        setTasks(updatedTasks);
        setEditingIndex(null);
    }
    function cancelEdit(){
        setEditText("");
        setEditingIndex(null);
    }

    function done(index){
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = true;
        setTasks(updatedTasks);
    }
    function deleteTask(id){
        setTasks(t => t.filter((task, index) => task.id !== id))
    }

    return(
    <>
        <div className="container">
            <label className="theme-switch">
                <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(prev => !prev)}
                />
                <span className="slider"></span>
            </label>
            
            <h1>ToDo App</h1>

            <div className="input-container">
                <input 
                    type="text" 
                    placeholder="Type new task..." 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === "Enter"){
                            addTask()
                        }
                    }}  
                />
                <button onClick={addTask} className="add-button">Add Task</button>
            </div>

            <div className="tasks-container">
                {
                    tasks.length === 0 ?
                        (<p className="empty-message">No tasks yet.</p>)
                        :
                        (<div className="tasks-content">
                            <div className="filter-button-container">
                                <button className={`filter-button ${filter === "all" ? "active-filter" : ""}`} onClick={() => setFilter("all")}>All</button>
                                <button className={`filter-button ${filter === "active" ? "active-filter" : ""}`} onClick={() => setFilter("active")}>Active</button>
                                <button className={`filter-button ${filter === "completed" ? "active-filter" : ""}`} onClick={() => setFilter("completed")}>Completed</button>
                            </div>
                            <ul>
                                {tasks.filter((task) => {
                                    if(filter === "all"){
                                        return true;
                                    }
                                    if(filter === "active"){
                                        return task.completed === false;
                                    }
                                    if(filter === "completed"){
                                        return task.completed === true;
                                    }
                                })
                                .map((task, index) => 
                                <li key={task.id}>
                                    {editingIndex === index ? 
                                        <input 
                                            type="text"
                                            autoFocus
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onBlur={saveEdit}
                                            onKeyDown={(e) => {
                                                if(e.key === "Enter"){
                                                    saveEdit();
                                                }
                                                if(e.key === "Escape"){
                                                    cancelEdit()
                                                }
                                            }}    
                                        />
                                        : <>
                                    
                                            <span onDoubleClick={task.completed ? undefined : () => handleDoubleClick(index)} style={{textDecoration: task.completed ? "line-through" : "none"}}>{task.text}</span>
                                            <div className="buttons-container">
                                                {task.completed ? (
                                                    <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>)
                                                : (
                                                    <>
                                                        <button className="done-btn" onClick={() => done(index)}>Done</button>
                                                        <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
                                                    </>
                                                )
                                                }
                                            </div>
                                        </>
                                    }
                                </li>)
                                }
                            </ul>
                        </div>
                    )
                }
            </div>
        </div>
    </>
    )

}
export default ToDoList
