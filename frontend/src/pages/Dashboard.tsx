import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateTeam from '../components/CreateTeam';
import CreateTask from '../components/CreateTask';
import TaskList from '../components/TaskList';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
            <p className='text-gray-600'>Welcome back, {user?.name}</p>
          </div>
          <button
            className='bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors'
            onClick={onLogout}
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Actions */}
          <div className="lg:col-span-1 space-y-8">
             <CreateTeam />
             <CreateTask />
          </div>

          {/* Right Column: Tasks Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md min-h-[500px]">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">My Tasks</h2>
              <TaskList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
