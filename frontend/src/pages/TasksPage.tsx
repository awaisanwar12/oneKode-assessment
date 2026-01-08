import { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import CreateTask from '../components/CreateTask';
import TaskBoard from '../components/TaskBoard';
import Layout from '../components/Layout';
import { FiFilter } from 'react-icons/fi';

const TasksPage = () => {
    const { teams } = useTeams();
    const [filters, setFilters] = useState({
        priority: '',
        teamId: ''
    });

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>My Tasks</h1>
                    <p className='text-gray-500 mt-1'>Manage and track your project tasks</p>
                </div>
                <CreateTask />
            </div>

            <div className="space-y-4 h-[calc(100vh-200px)] flex flex-col">
                <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm items-center justify-between">
                     <h2 className="text-lg font-bold text-gray-800">Task Board</h2>
                    <div className="flex gap-2">
                         <div className="relative group">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:bg-gray-100 transition-colors"
                                value={filters.priority}
                                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                            >
                                <option value="">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                               <FiFilter size={14} />
                            </div>
                        </div>

                        <div className="relative">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:bg-gray-100 transition-colors"
                                value={filters.teamId}
                                onChange={(e) => setFilters(prev => ({ ...prev, teamId: e.target.value }))}
                            >
                                <option value="">All Teams</option>
                                {teams?.map(team => (
                                    <option key={team._id} value={team._id}>{team.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                               <FiFilter size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <TaskBoard filters={filters} />
                </div>
            </div>
        </Layout>
    );
};

export default TasksPage;
