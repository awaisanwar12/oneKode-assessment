import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTeams } from '../hooks/useTeams';
import { toast } from 'react-toastify';

const CreateTask = () => {
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
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                teamId: '',
                assignedTo: '',
                dueDate: ''
            });
            toast.success('Task created successfully');
        } catch (error: any) {
             toast.error(error.response?.data?.message || 'Failed to create task');
        }
    }

    if (!teams || teams.length === 0) {
        return <div className="p-4 bg-yellow-100 rounded text-yellow-700">You need to join or create a team to create tasks.</div>
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <input 
                        type="text" 
                        name="title"
                        placeholder="Task Title" 
                        value={formData.title} 
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                 <div className="col-span-2">
                    <textarea 
                        name="description"
                        placeholder="Description" 
                        value={formData.description} 
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                
                <select 
                    name="teamId" 
                    value={formData.teamId} 
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                        <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                </select>

                 <select 
                    name="priority" 
                    value={formData.priority} 
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>

                <select 
                    name="assignedTo" 
                    value={formData.assignedTo} 
                    onChange={handleChange}
                    className="border p-2 rounded"
                    disabled={!selectedTeam}
                >
                    <option value="">Assign To (Optional)</option>
                    {selectedTeam?.members.map(member => (
                        <option key={member._id} value={member._id}>{member.name} ({member.email})</option>
                    ))}
                </select>

                <input 
                    type="date" 
                    name="dueDate"
                    value={formData.dueDate} 
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <button type="submit" className="col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700">
                    Create Task
                </button>
            </form>
        </div>
    )
}

export default CreateTask;
