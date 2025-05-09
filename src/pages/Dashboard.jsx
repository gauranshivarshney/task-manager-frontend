import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { FaTasks, FaCheckCircle, FaSpinner, FaList } from 'react-icons/fa';
import styles from './Dashboard.module.css';
import { useAuth } from '../context/userContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();

  const [cardData, setCardData] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [tempSearch, setTempSearch] = useState('');
  const [tempStatus, setTempStatus] = useState('');
  const [tempPriority, setTempPriority] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    axios.get('https://task-manager-backend-xj6y.onrender.com/api/dashboard/cards')
      .then(response => setCardData(response.data || []))
      .catch(error => {
        console.error('Error fetching card data:', error);
        setCardData([]);
      });

    axios.get('https://task-manager-backend-xj6y.onrender.com/api/dashboard/tasks')
      .then(response => setTasks(response.data || []))
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      });
  }, []);

  const applyFilters = () => {
    setStatusFilter(tempStatus);
    setPriorityFilter(tempPriority);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.taskTitle
      .toLowerCase()
      .split(' ')
      .some(word => word.startsWith(tempSearch.toLowerCase()));
    const matchesStatus = statusFilter ? task.stage.toLowerCase() === statusFilter.toLowerCase() : true;
    const matchesPriority = priorityFilter ? task.priority.toLowerCase() === priorityFilter.toLowerCase() : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.searchAndUser}>
          <input
            type="text"
            placeholder="Search by title..."
            className={styles.searchInput}
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}  
          />
          <div className={styles.usernameContainer}>
            {user ? <span className={styles.username}>{user.username}</span> : <span>Loading...</span>}
          </div>
        </div>

        <div className={styles.filterContainer}>
          <select value={tempStatus} onChange={(e) => setTempStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="To do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select value={tempPriority} onChange={(e) => setTempPriority(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="Normal">Normal</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button className={styles.doneButton} onClick={applyFilters}>Done</button>
        </div>

        <div className={styles.cardsContainer}>
          {cardData.length > 0 ? cardData.map((card, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{card.title}</h4>
                <p className={styles.cardCount}>{card.count}</p>
              </div>
              <div className={styles.cardIcon} style={{ backgroundColor: card.bgColor }}>
                {card.icon === 'check-circle' && <FaCheckCircle />}
                {card.icon === 'spinner' && <FaSpinner />}
                {card.icon === 'list' && <FaList />}
                {card.icon === 'task-icon' && <FaTasks />}
              </div>
            </div>
          )) : <p>No card data...</p>}
        </div>

        <div className={styles.taskTable}>
          <h3>Tasks</h3>

          {(tempSearch || statusFilter || priorityFilter) && filteredTasks.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.taskTitle}</td>
                    <td>{task.stage}</td>
                    <td>{task.priority}</td>
                    <td>{task.dueDate ? task.dueDate.slice(0, 10) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No tasks found for the selected filters or search term.</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;