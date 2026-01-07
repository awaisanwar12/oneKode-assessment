import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTeams } from '../hooks/useTeams';
import CreateTeam from '../components/CreateTeam';
import CreateTask from '../components/CreateTask';
import TaskBoard from '../components/TaskBoard';
import TeamManagement from '../components/TeamManagement';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { teams } = useTeams(); // Fetch teams for filter
  
  const [filters, setFilters] = useState({
    priority: '',
    teamId: ''
  });

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
      <div className="max-w-[1600px] mx-auto">
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column: Team Management & Actions */}
          <div className="xl:col-span-1 space-y-8 h-fit">
             <CreateTeam />
             <TeamManagement />
             <CreateTask />
          </div>

          {/* Right Column: Task Board */}
          <div className="xl:col-span-3">
             <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800">Task Board</h2>
                
                {/* Filters */}
                <div className="flex gap-2">
                    <select 
                        className="border rounded p-2 text-sm bg-white"
                        value={filters.priority}
                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <select 
                        className="border rounded p-2 text-sm bg-white"
                        value={filters.teamId}
                        onChange={(e) => setFilters(prev => ({ ...prev, teamId: e.target.value }))}
                    >
                        <option value="">All Teams</option>
                        {teams?.map(team => (
                            <option key={team._id} value={team._id}>{team.name}</option>
                        ))}
                    </select>
                </div>
             </div>
             <TaskBoard filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
