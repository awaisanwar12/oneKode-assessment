import { useState } from 'react';
import { Task } from '../types';
import { useTeams } from '../hooks/useTeams';
import { FaTimes } from 'react-icons/fa';

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onUpdate: (id: string, data: any) => Promise<void>;
}

const EditTaskModal = ({ task, onClose, onUpdate }: EditTaskModalProps) => {
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo?._id || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });

    const { teams } = useTeams();
    // In edit mode, we generally want to see members of the task's team.
    // Assuming task type includes teamId populated or not. 
    // If populated, use ._id, if string, use it directly.
    const teamId = typeof task.teamId === 'string' ? task.teamId : task.teamId?._id;
    const selectedTeam = teams?.find(t => t._id === teamId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onUpdate(task._id, formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={20} />
                </button>
                
                <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            className="w-full border p-2 rounded mt-1"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea 
                            name="description" 
                            rows={3}
                            value={formData.description} 
                            onChange={handleChange} 
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Priority</label>
                             <select 
                                name="priority" 
                                value={formData.priority} 
                                onChange={handleChange}
                                className="w-full border p-2 rounded mt-1"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700">Assign To</label>
                             <select 
                                name="assignedTo" 
                                value={formData.assignedTo} 
                                onChange={handleChange}
                                className="w-full border p-2 rounded mt-1"
                                disabled={!selectedTeam}
                            >
                                <option value="">Unassigned</option>
                                {selectedTeam?.members.map(member => (
                                    <option key={member._id} value={member._id}>{member.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input 
                            type="date" 
                            name="dueDate" 
                            value={formData.dueDate} 
                            onChange={handleChange} 
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;
