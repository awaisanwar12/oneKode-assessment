import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth(); // Using Context

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold mb-4'>Dashboard</h1>
      <p className='text-xl mb-8'>Welcome {user?.name}</p>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
