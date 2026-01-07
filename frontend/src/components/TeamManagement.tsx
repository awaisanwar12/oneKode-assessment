import { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { Team, User } from '../types';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const TeamCard = ({ team, onAddMember }: { team: Team, onAddMember: (teamId: string, email: string) => Promise<void> }) => {
    const [email, setEmail] = useState('');
    const { user } = useAuth();
    const isOwner = team.createdBy === user?._id;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onAddMember(team._id, email);
            setEmail('');
            toast.success('Member added successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add member');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
                {isOwner && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Owner</span>}
            </div>
            {team.description && <p className="text-gray-600 mb-4">{team.description}</p>}
            
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Members ({team.members.length})</h4>
                <div className="flex flex-wrap gap-2">
                    {team.members.map((member: any) => ( // Type any because population might vary slightly
                        <div key={member._id || member} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-500 rounded-full text-white flex items-center justify-center text-xs">
                                {(member.name || 'U').charAt(0).toUpperCase()}
                            </span>
                            <span>{member.name || member.email || 'Unknown'}</span>
                        </div>
                    ))}
                </div>
            </div>

            {isOwner && (
                <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-gray-100">
                    <label className="text-xs font-semibold text-gray-500 mb-2 block">Add Member</label>
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            placeholder="User Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 border p-2 rounded text-sm"
                            required
                        />
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

const TeamManagement = () => {
    const { teams, isLoading, isError, addMember } = useTeams();

    if (isLoading) return <div>Loading teams...</div>;
    if (isError) return <div>Error loading teams.</div>;

    if (!teams || teams.length === 0) {
        return <div className="text-gray-500">No teams found. Create one above!</div>;
    }

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">My Teams</h2>
             </div>
            <div className="grid grid-cols-1 gap-6">
                {teams.map(team => (
                    <TeamCard key={team._id} team={team} onAddMember={addMember} />
                ))}
            </div>
        </div>
    );
};

export default TeamManagement;
