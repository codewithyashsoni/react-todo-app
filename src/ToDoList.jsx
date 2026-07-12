import React, {useState , useEffect} from "react"

function ToDoList(){
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editingIndex,setEditingIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(true);



    useEffect(() => {
        document.body.className = isDarkMode ? "" : "light-theme";
    }, [isDarkMode])

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
                        (
                        <ul>
                            {tasks.map((task, index) => 
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
                    )
                }
            </div>
        </div>
    </>
    )

}
export default ToDoList
