import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTeams } from '../hooks/useTeams';
import { useTasks } from '../hooks/useTasks';
import Layout from '../components/Layout';
import CreateTaskModal from '../components/CreateTaskModal';
import { FiCheckCircle, FiUsers, FiActivity, FiPlus, FiClock, FiList } from 'react-icons/fi';
import clsx from 'clsx';

function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { teams } = useTeams(); 
  const { tasks } = useTasks();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) return <div className="flex justify-center items-center h-screen text-indigo-600">Loading...</div>;

  // Compute Stats
  const myTasks = tasks?.filter(t => t.assignedTo?._id === user?._id || (typeof t.assignedTo === 'string' && t.assignedTo === user?._id)) || [];
  const pendingTasks = tasks?.filter(t => t.status !== 'done') || [];
  const completedTasks = tasks?.filter(t => t.status === 'done') || [];
  
  // Recent Tasks (My Pending)
  const recentTasks = myTasks.filter(t => t.status !== 'done').slice(0, 5);

  return (
    <Layout>
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
                <p className='text-gray-500 mt-1'>Welcome back, {user?.name}</p>
            </div>
            
            <button 
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
                <FiPlus size={20} />
                <span>Quick Create Task</span>
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FiUsers size={24} />
                 </div>
                 <div>
                    <p className="text-gray-500 text-sm font-medium">Active Teams</p>
                    <p className="text-2xl font-bold text-gray-900">{teams?.length || 0}</p>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <FiList size={24} />
                 </div>
                 <div>
                    <p className="text-gray-500 text-sm font-medium">My Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{myTasks.length}</p>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                 <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                    <FiClock size={24} />
                 </div>
                 <div>
                    <p className="text-gray-500 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
                 </div>
            </div>

             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                 <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <FiCheckCircle size={24} />
                 </div>
                 <div>
                    <p className="text-gray-500 text-sm font-medium">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
                 </div>
            </div>
        </div>

        {/* content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* My Tasks Overview */}
             <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">My Priority Tasks</h2>
                    <button onClick={() => navigate('/tasks')} className="text-indigo-600 text-sm font-medium hover:text-indigo-700">View All</button>
                </div>
                <div className="p-6">
                    {recentTasks.length > 0 ? (
                        <div className="space-y-4">
                            {recentTasks.map(task => (
                                <div key={task._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx("w-2 h-2 rounded-full", {
                                            'bg-red-500': task.priority === 'high',
                                            'bg-yellow-500': task.priority === 'medium',
                                            'bg-green-500': task.priority === 'low'
                                        })}></div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                                            <p className="text-sm text-gray-500 truncate max-w-md">{task.description || 'No description'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-medium px-2.5 py-1 rounded bg-white border border-gray-200 text-gray-600 capitalize">
                                            {task.status.replace('_', ' ')}
                                        </span>
                                        {task.dueDate && (
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <FiClock size={12} />
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                <FiCheckCircle size={32} />
                            </div>
                            <p className="text-gray-500">You have no pending tasks!</p>
                            <button onClick={() => setIsCreateTaskModalOpen(true)} className="text-indigo-600 font-medium mt-2 hover:underline">Create one now</button>
                        </div>
                    )}
                </div>
             </div>

             {/* Right Column: Activity / Promo */}
             <div className="space-y-6">
                 {/* Role Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                             <p className="text-indigo-100 text-sm font-medium mb-1">Current Role</p>
                             <h3 className="text-2xl font-bold capitalize">{user?.role}</h3>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <FiActivity size={24} />
                        </div>
                    </div>
                    <div className="flex gap-3">
                         <button 
                            onClick={() => navigate('/teams')} 
                             className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
                        >
                            My Teams
                        </button>
                         <button 
                            onClick={() => navigate('/tasks')} 
                            className="flex-1 bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            My Tasks
                        </button>
                    </div>
                </div>
             </div>
        </div>

        {isCreateTaskModalOpen && (
            <CreateTaskModal onClose={() => setIsCreateTaskModalOpen(false)} />
        )}

    </Layout>
  );
}

export default Dashboard;
