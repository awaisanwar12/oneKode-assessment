import { useState } from 'react';
import { Team } from '../types';
import { FaTimes } from 'react-icons/fa';

interface EditTeamModalProps {
    team: Team;
    onClose: () => void;
    onUpdate: (id: string, data: any) => Promise<void>;
}

const EditTeamModal = ({ team, onClose, onUpdate }: EditTeamModalProps) => {
    const [formData, setFormData] = useState({
        name: team.name,
        description: team.description || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onUpdate(team._id, formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={20} />
                </button>
                
                <h2 className="text-xl font-bold mb-4">Edit Team</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Team Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
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

export default EditTeamModal;
