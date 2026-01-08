import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { FaTrash, FaEdit, FaUserCircle, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import EditTaskModal from './EditTaskModal';
import { useState } from 'react';

const TaskBoard = ({ filters }: { filters?: any }) => {
    const { tasks, isLoading, isError, updateTask, deleteTask } = useTasks(filters);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    if (isLoading) return <div>Loading board...</div>;
    if (isError) return <div>Error loading board.</div>;

    const columns = {
        todo: { name: 'To Do', items: tasks?.filter(t => t.status === 'todo') || [] },
        in_progress: { name: 'In Progress', items: tasks?.filter(t => t.status === 'in_progress') || [] },
        review: { name: 'Review', items: tasks?.filter(t => t.status === 'review') || [] },
        done: { name: 'Done', items: tasks?.filter(t => t.status === 'done') || [] }
    };

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;
        
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
             // Optimistic update could be done here for smoother UI
            
            // Call API to update status
            try {
                await updateTask({
                    id: draggableId,
                    data: { status: destination.droppableId }
                });
            } catch (error) {
                console.error("Failed to update task status", error);
            }
        }
    };

    const priorityColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800'
    };


    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent drag start when clicking delete
        if(window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
                toast.success('Task deleted');
            } catch (error) {
                toast.error('Failed to delete task');
            }
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 h-full">
            <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(columns).map(([columnId, column]) => (
                    <div key={columnId} className="flex flex-col min-w-[300px] bg-gray-100 rounded-lg p-4 h-min">
                        <h2 className="font-bold text-gray-700 mb-4 flex justify-between items-center">
                            {column.name}
                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                                {column.items.length}
                            </span>
                        </h2>
                        
                        <Droppable droppableId={columnId}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`flex-1 min-h-[100px] transition-colors ${
                                        snapshot.isDraggingOver ? 'bg-gray-200' : ''
                                    }`}
                                >
                                    {column.items.map((task: Task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`bg-white p-4 mb-3 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                                                        snapshot.isDragging ? 'rotate-2' : ''
                                                    }`}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                                                            {task.priority.toUpperCase()}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => setEditingTask(task)}
                                                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                                                title="Edit Task"
                                                            >
                                                                <FaEdit size={12} />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => handleDelete(e, task._id)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                title="Delete Task"
                                                            >
                                                                <FaTrash size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-gray-800 mb-1">{task.title}</h4>
                                                     {task.description && (
                                                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{task.description}</p>
                                                     )}
                                                     
                                                     <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1" title="Due Date">
                                                            <FaCalendarAlt size={10} />
                                                            <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1" title={task.assignedTo ? `Assigned to: ${task.assignedTo.name}` : 'Unassigned'}>
                                                            <FaUserCircle size={12} className={task.assignedTo ? 'text-blue-500' : 'text-gray-300'} />
                                                            <span>{task.assignedTo ? task.assignedTo.name.split(' ')[0] : 'Unassigned'}</span>
                                                        </div>
                                                     </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>
            {editingTask && (
                <EditTaskModal 
                    task={editingTask} 
                    onClose={() => setEditingTask(null)} 
                    onUpdate={async (id, data) => {
                        await updateTask({id, data});
                        setEditingTask(null);
                        toast.success("Task updated");
                    }}
                />
            )}
        </div>
    );
};

export default TaskBoard;
