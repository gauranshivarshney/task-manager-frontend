import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/userContext'; 
import './login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth(); 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        await login(data);
        console.log('Logged in successfully');
        navigate('/dashboard');
      } else {
        await signup(data);
        console.log('Signed up successfully');
        setIsLogin(true); 
      }
    } catch (error) {
      console.error(error.message); 
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  {...register('fullName', { required: 'Full Name is required' })}
                />
                {errors.fullName && <p className="error">{errors.fullName.message}</p>}
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                />
                {errors.username && <p className="error">{errors.username.message}</p>}
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;