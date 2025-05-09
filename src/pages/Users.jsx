import { useState, useEffect } from "react";
import axios from 'axios';
import styles from './Users.module.css';
import Sidebar from "../components/Sidebar";
import { useAuth } from '../context/userContext';

export default function Users() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "",
  });
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  useEffect(() => {
    axios.get('https://task-manager-backend-xj6y.onrender.com/api/teamMembers')
      .then(response => {
        setTeamMembers(response.data);
      })
      .catch(error => {
        console.error("Error fetching team members:", error);
      });
  }, []);

  const deleteMember = (email) => {
    axios.delete(`https://task-manager-backend-xj6y.onrender.com/api/teamMembers/${email}`)
      .then(() => {
        setTeamMembers(teamMembers.filter((member) => member.email !== email));
      })
      .catch(error => {
        console.error("Error deleting team member:", error);
      });
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const addNewUser = () => {
    if (newUser.fullName && newUser.email && newUser.role) {
      axios.post('https://task-manager-backend-xj6y.onrender.com/api/teamMembers', newUser)
        .then(response => {
          setTeamMembers([...teamMembers, response.data]);
          setShowAddUserForm(false);
          setNewUser({
            fullName: "",
            email: "",
            role: "",
          });
        })
        .catch(error => {
          console.error("Error adding team member:", error);
        });
    }
  };

  return (
    <div className={styles.teamContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.teamHeader}>
          <h2>Team Members</h2>
          <button
            className={styles.addUserBtn}
            onClick={() => setShowAddUserForm(!showAddUserForm)} 
          >
            + Add New User
          </button>
        </div>

        {showAddUserForm && (
          <div className={styles.addUserForm}>
            <h3>Add New User</h3>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={handleAddUserChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleAddUserChange}
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={newUser.role}
              onChange={handleAddUserChange}
            />
            <button className={styles.addUserBtnSave} onClick={addNewUser}>
              Save User
            </button>
            <button className={styles.addUserBtnCancel} onClick={() => setShowAddUserForm(false)}>
              Cancel
            </button>
          </div>
        )}

        <table className={styles.teamTable}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, idx) => (
              <tr key={idx}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>
                  <span
                    className={`${styles.actionLink} ${styles.delete}`}
                    onClick={() => deleteMember(member.email)} 
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}