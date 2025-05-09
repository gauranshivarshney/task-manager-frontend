import { MdDashboard, MdOutlineAddTask, MdOutlinePendingActions, MdTaskAlt } from 'react-icons/md';
import { FaTasks, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useAuth } from '../context/userContext';

const linkData = [
    {
        label: 'Dashboard',
        link: '/dashboard',
        icon: <MdDashboard />,
    },
    {
        label: 'Tasks',
        link: '/tasks',
        icon: <FaTasks />,
    },
    {
        label: 'Completed',
        link: '/completed/completed',
        icon: <MdTaskAlt />,
    },
    {
        label: 'In Progress',
        link: '/in-progress/in-progress',
        icon: <MdOutlinePendingActions />,
    },
    {
        label: 'To Do',
        link: '/todo/todo',
        icon: <MdOutlinePendingActions />,
    },
    {
        label: 'Team',
        link: '/team',
        icon: <FaUsers />,
    }
];

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarContainer}>
                <div className={styles.taskMeContainer}>
                    <Link to="/dashboard" className={styles.taskMeLink}>
                        <MdOutlineAddTask className={styles.taskMeIcon} />
                        <span className={styles.taskMeLabel}>TaskMe</span>
                    </Link>
                </div>

                <ul className={styles.sidebarLinks}>
                    {linkData.map((linkItem, index) => (
                        <li key={index} className={styles.sidebarItem}>
                            <Link to={linkItem.link} className={styles.sidebarLink}>
                                <div className={styles.sidebarIcon}>{linkItem.icon}</div>
                                <span className={styles.sidebarLabel}>{linkItem.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className={styles.logoutContainer}>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        <FaSignOutAlt className={styles.sidebarIcon} />
                        <span className={styles.sidebarLabel}>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;