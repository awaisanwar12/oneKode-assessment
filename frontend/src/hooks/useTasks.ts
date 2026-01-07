import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Task } from '../types';

interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  teamId: string;
  assignedTo?: string;
  dueDate?: string;
}

export const useTasks = (filters?: any) => {
  const queryClient = useQueryClient();

  // Construct query string from filters
  const queryString = new URLSearchParams(filters).toString();

  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks', queryString], // Include filters in key
    queryFn: async () => {
      const res = await api.get(`/tasks?${queryString}`);
      return res.data.data as Task[];
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: CreateTaskData) => {
        // Ensure teamId is sent
      const res = await api.post('/tasks', newTask);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  const updateTaskMutation = useMutation({
      mutationFn: async ({id, data}: {id: string, data: Partial<CreateTaskData>}) => {
          const res = await api.put(`/tasks/${id}`, data);
          return res.data.data;
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tasks']});
      }
  })

  const deleteTaskMutation = useMutation({
      mutationFn: async (id: string) => {
          await api.delete(`/tasks/${id}`);
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tasks']});
      }
  })

  return {
    tasks,
    isLoading,
    isError,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync
  };
};
