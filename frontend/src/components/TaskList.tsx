import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';

const TaskCard = ({ task }: { task: Task }) => {
    
    const priorityColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800'
    };

    const statusColors = {
        todo: 'bg-gray-100 text-gray-800',
        in_progress: 'bg-blue-100 text-blue-800',
        review: 'bg-purple-100 text-purple-800',
        done: 'bg-green-100 text-green-800'
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority.toUpperCase()}
                </span>
                 <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                </span>
            </div>
            <h4 className="text-lg font-bold mb-1">{task.title}</h4>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
            
            <div className="text-xs text-gray-500 flex flex-col gap-1">
                {task.dueDate && <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>}
                {/* <div>Team: {(task.teamId as any).name || 'Unknown Team'}</div>  */}
            </div>
        </div>
    )
}

const TaskList = () => {
    const { tasks, isLoading, isError } = useTasks();

    if (isLoading) return <div>Loading tasks...</div>;
    if (isError) return <div>Error loading tasks.</div>;

    if (!tasks || tasks.length === 0) {
        return <div className="text-center text-gray-500 py-8">No tasks found.</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
                <TaskCard key={task._id} task={task} />
            ))}
        </div>
    )
}

export default TaskList;
