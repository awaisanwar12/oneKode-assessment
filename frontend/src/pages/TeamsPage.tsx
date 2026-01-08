import CreateTeam from '../components/CreateTeam';
import TeamManagement from '../components/TeamManagement';
import Layout from '../components/Layout';

const TeamsPage = () => {
    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>My Teams</h1>
                    <p className='text-gray-500 mt-1'>Collaborate and manage team members</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Team Section */}
                <div className="lg:col-span-1">
                     <CreateTeam />
                </div>

                {/* Team List Section */}
                <div className="lg:col-span-2">
                     <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <TeamManagement />
                     </div>
                </div>
            </div>
        </Layout>
    );
};

export default TeamsPage;
