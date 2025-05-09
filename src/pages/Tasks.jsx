import { useState, useEffect } from "react";
import TaskModal from "../pages/TasksModal";
import styles from "./Tasks.module.css";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/userContext";
import { FiPlus } from 'react-icons/fi';
import axios from "axios";

export default function Tasks({ stage }) { 
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("https://task-manager-backend-xj6y.onrender.com/api/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (taskData) => {
    try {
      const res = await axios.post('https://task-manager-backend-xj6y.onrender.com/api/tasks', taskData)
      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`https://task-manager-backend-xj6y.onrender.com/api/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.taskTitle.toLowerCase().includes(search.toLowerCase()) &&
    (stage ? task.stage === stage : true) 
  );

  return (
    <div className={styles.tasksContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.tasksHeader}>
          <h1>{stage ? `${stage} Tasks` : 'All Tasks'}</h1>
          {!stage && (
            <button className={styles.createBtn} onClick={() => setModalOpen(true)}>
              <FiPlus style={{ marginRight: "6px" }} />
              Create Task
            </button>
          )}
        </div>

        <TaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddTask}
        />

        <div className={styles.taskList}>
          {filteredTasks.map((task) => (
            <div className={styles.taskCard} key={task._id}>
              <div className={styles.taskHeader}>
                <span className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}>
                  {task.priority}
                </span>
                <span className={styles.dueDate}>Due date:
                  {task.dueDate && !isNaN(new Date(task.dueDate))
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No Due Date"}
                </span>
              </div>
              <h3 className={styles.taskTitle}>{task.taskTitle}</h3>
              <div className={styles.taskMeta}>
                <span><strong>Assignee:</strong> {task.assignee.fullName}</span>
                <span><strong>Stage:</strong> {task.stage}</span>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}