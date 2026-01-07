import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Team } from '../types';

export const useTeams = () => {
  const queryClient = useQueryClient();

  const { data: teams, isLoading, isError } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await api.get('/teams');
      return res.data.data as Team[];
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: async (newTeam: { name: string; description?: string; members?: string[] }) => {
      const res = await api.post('/teams', newTeam);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async ({ teamId, email }: { teamId: string; email: string }) => {
      const res = await api.post(`/teams/${teamId}/members`, { email });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  return {
    teams,
    isLoading,
    isError,
    createTeam: createTeamMutation.mutateAsync,
    addMember: addMemberMutation.mutateAsync,
  };
};
