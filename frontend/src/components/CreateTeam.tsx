import { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { toast } from 'react-toastify';

const CreateTeam = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { createTeam } = useTeams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTeam({ name, description });
            setName('');
            setDescription('');
            toast.success('Team created successfully');
        } catch (error: any) {
             toast.error(error.response?.data?.message || 'Failed to create team');
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    type="text" 
                    placeholder="Team Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                 <input 
                    type="text" 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Create Team
                </button>
            </form>
        </div>
    )
}

export default CreateTeam;
