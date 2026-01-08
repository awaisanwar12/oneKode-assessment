import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTeams } from '../hooks/useTeams';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

interface CreateTaskModalProps {
    onClose: () => void;
}

const CreateTaskModal = ({ onClose }: CreateTaskModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        teamId: '',
        assignedTo: '',
        dueDate: ''
    });

    const { teams } = useTeams();
    const { createTask } = useTasks();

    const selectedTeam = teams?.find(t => t._id === formData.teamId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(!formData.teamId) {
            toast.error("Please select a team");
            return;
        }

        try {
            await createTask(formData);
            toast.success('Task created successfully');
            onClose();
        } catch (error: any) {
             toast.error(error.response?.data?.message || 'Failed to create task');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg relative shadow-xl transform transition-all scale-100">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimes size={20} />
                </button>
                
                <h2 className="text-xl font-bold mb-6 text-gray-800">Create New Task</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            name="title"
                            placeholder="Task Title" 
                            value={formData.title} 
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    
                    <div>
                        <textarea 
                            name="description"
                            placeholder="Description" 
                            rows={3}
                            value={formData.description} 
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <select 
                            name="teamId" 
                            value={formData.teamId} 
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                            required
                        >
                            <option value="">Select Team</option>
                            {teams?.map(team => (
                                <option key={team._id} value={team._id}>{team.name}</option>
                            ))}
                        </select>

                        <select 
                            name="priority" 
                            value={formData.priority} 
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <select 
                            name="assignedTo" 
                            value={formData.assignedTo} 
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                            disabled={!selectedTeam}
                        >
                            <option value="">Assign To (Optional)</option>
                            {selectedTeam?.members.map(member => (
                                <option key={member._id} value={member._id}>{member.name}</option>
                            ))}
                        </select>

                        <input 
                            type="date" 
                            name="dueDate"
                            value={formData.dueDate} 
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTaskModal;
