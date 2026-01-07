export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'member' | 'lead' | 'admin';
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  members: User[]; // populated
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: User; // populated
  teamId: string | Team; // populated or id
  dueDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
