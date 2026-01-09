import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='w-full max-w-md bg-white p-8 rounded shadow-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Login to Your Account</h1>
        <form onSubmit={onSubmit}>
          <div className='mb-4'>
            <input
              type='email'
              className='w-full border border-gray-300 p-2 rounded'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
            />
          </div>
          <div className='mb-6'>
            <input
              type='password'
              className='w-full border border-gray-300 p-2 rounded'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
            />
          </div>
          <div className='flex items-center justify-between'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
            >
              Submit
            </button>
          </div>
        </form>
         <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
            </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
