import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import { AuthProvider, useAuth } from './context/userContext';
import Tasks from './pages/Tasks';

function Layout() {
  const { user, loading } = useAuth(); 

  const location = useLocation();
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? (
    <div>
      <div>
      </div>
      <div>
        <div>
          <Outlet /> 
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/log-in' state={{ from: location }} replace /> 
  );
}

function App() {
  return (
    <AuthProvider>
      <main>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Navigate to='/dashboard' />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/completed/:status' element={<Tasks stage="Completed" />} />
            <Route path='/in-progress/:status' element={<Tasks stage="In Progress" />} />
            <Route path='/todo/:status' element={<Tasks stage="To do" />} />
            <Route path='/team' element={<Users />} />
          </Route>
          <Route path='/log-in' element={<Login />} /> 
        </Routes>
        <Toaster richColors />
      </main>
    </AuthProvider>
  );
}

export default App;