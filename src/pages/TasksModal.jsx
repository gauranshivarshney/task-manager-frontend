import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TasksModal.module.css";

export default function Tasks({ isOpen, onClose, onSubmit }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [stage, setStage] = useState("To do");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    axios
      .get("https://task-manager-backend-xj6y.onrender.com/api/teamMembers") 
      .then((response) => {
        setTeamMembers(response.data);
        setAssignee(response.data[0]?._id || ""); 
      })
      .catch((error) => {
        console.error("Error fetching team members:", error);
      });
  }, []);

  const handleSubmit = () => {
    if (!taskTitle || !dueDate) return; 
    onSubmit({ taskTitle, assignee, stage, dueDate, priority });
    setTaskTitle("");
    setAssignee(teamMembers[0]?._id || ""); 
    setStage("To do");
    setDueDate("");
    setPriority("Normal");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Add Task</h2>

        <div className={styles.formGroup}>
          <label>Task Title</label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task title"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Assign Task To</label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            {teamMembers.length === 0 ? (
              <option value="">None</option> 
            ) : (
              teamMembers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName}
                </option>
              ))
            )}
          </select>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Task Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              <option value="To do">To do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Task Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Priority Level</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Normal">Normal</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.btn} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}