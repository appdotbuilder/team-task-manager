import React from 'react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';

interface Task {
    id: number;
    name: string;
    description: string;
    image_path: string;
    due_date: string;
    priority_level: string;
    status: string;
    assignment_type: string;
    items_completed: number;
    creator: {
        name: string;
    };
    assigned_division?: {
        name: string;
    };
    assigned_user?: {
        name: string;
    };
    taken_by_user?: {
        name: string;
    };
}

interface Props {
    tasks: {
        data: Task[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
    };
    userRole: string;
    [key: string]: unknown;
}

const statusLabels = {
    belum_dimulai: 'Belum Dimulai',
    sedang_dikerjakan: 'Sedang Dikerjakan',
    di_tinjau: 'Di Tinjau',
    diterima: 'Diterima',
    selesai: 'Selesai',
};

const statusColors = {
    belum_dimulai: 'bg-gray-100 text-gray-800',
    sedang_dikerjakan: 'bg-blue-100 text-blue-800',
    di_tinjau: 'bg-yellow-100 text-yellow-800',
    diterima: 'bg-green-100 text-green-800',
    selesai: 'bg-purple-100 text-purple-800',
};

const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
};

const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
};

export default function TasksIndex({ tasks, userRole }: Props) {
    const handleTakeTask = (taskId: number) => {
        router.post('/tasks', {
            action: 'take_task',
            task_id: taskId,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📋 Task Management</h1>
                        <p className="text-gray-600 mt-2">
                            {userRole === 'manager' ? 'Manage your created tasks' : 'View and work on assigned tasks'}
                        </p>
                    </div>
                    {userRole === 'manager' && (
                        <Link href="/tasks/create">
                            <Button>Create New Task</Button>
                        </Link>
                    )}
                </div>

                {/* Tasks Grid */}
                {tasks.data.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
                        <p className="text-gray-500">
                            {userRole === 'manager' 
                                ? 'Create your first task to get started.' 
                                : 'No tasks have been assigned to you yet.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {tasks.data.map((task) => (
                                <div key={task.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    {/* Task Image */}
                                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                        <img 
                                            src={`/storage/${task.image_path}`}
                                            alt={task.name}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTY4IDk2SDE5MkwxNjggMTIwSDE0NEwxMjAgOTZIMTQ0VjcyWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="p-4">
                                        {/* Status and Priority */}
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status as keyof typeof statusColors]}`}>
                                                {statusLabels[task.status as keyof typeof statusLabels]}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority_level as keyof typeof priorityColors]}`}>
                                                {priorityLabels[task.priority_level as keyof typeof priorityLabels]}
                                            </span>
                                        </div>

                                        {/* Task Title */}
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.name}</h3>
                                        
                                        {/* Description */}
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>

                                        {/* Assignment Info */}
                                        <div className="text-xs text-gray-500 mb-3">
                                            <div>Created by: {task.creator.name}</div>
                                            <div>
                                                Assigned to: {task.assignment_type === 'division' 
                                                    ? task.assigned_division?.name 
                                                    : task.assigned_user?.name}
                                            </div>
                                            {task.taken_by_user && (
                                                <div>Working: {task.taken_by_user.name}</div>
                                            )}
                                        </div>

                                        {/* Due Date and Items */}
                                        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                                            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                            <span>Items: {task.items_completed}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex space-x-2">
                                            <Link href={`/tasks/${task.id}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    View Details
                                                </Button>
                                            </Link>
                                            
                                            {task.status === 'belum_dimulai' && userRole !== 'manager' && (
                                                <Button 
                                                    size="sm" 
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleTakeTask(task.id)}
                                                >
                                                    Take Task
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {tasks.last_page > 1 && (
                            <div className="flex justify-center">
                                <nav className="flex space-x-2">
                                    {tasks.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                link.active
                                                    ? 'bg-indigo-500 text-white'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 hover:bg-gray-50 border'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            preserveState
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}