import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const { register } = useAuth();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await register({ name, email, password, role: 'user' }); 
      navigate('/');
    } catch (error: any) {
       toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='w-full max-w-md bg-white p-8 rounded shadow-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Create an Account</h1>
        <form onSubmit={onSubmit}>
          <div className='mb-4'>
            <input
              type='text'
              className='w-full border border-gray-300 p-2 rounded'
              id='name'
              name='name'
              value={name}
              placeholder='Enter your name'
              onChange={onChange}
            />
          </div>
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
          <div className='mb-4'>
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
           <div className='mb-6'>
            <input
              type='password'
              className='w-full border border-gray-300 p-2 rounded'
              id='confirmPassword'
              name='confirmPassword'
              value={confirmPassword}
              placeholder='Confirm password'
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
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Login here
            </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
