import React, { useState } from 'react';
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
    initial_time_estimates: number[];
    current_time_estimate: number | null;
    items_completed: number;
    work_result_image: string | null;
    creator: {
        id: number;
        name: string;
    };
    assigned_division?: {
        name: string;
    };
    assigned_user?: {
        name: string;
    };
    taken_by_user?: {
        id: number;
        name: string;
    };
}

interface Props {
    task: Task;
    userRole: string;
    canTake: boolean;
    canUpdate: boolean;
    auth: {
        user: {
            id: number;
            name: string;
            role: string;
        };
    };
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

export default function TaskShow({ task, userRole, canTake, canUpdate, auth }: Props) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateData, setUpdateData] = useState({
        current_time_estimate: task.current_time_estimate || '',
        items_completed: task.items_completed || 0,
        work_result_image: null as File | null,
        status: task.status,
    });

    const handleTakeTask = () => {
        router.post('/tasks', {
            action: 'take_task',
            task_id: task.id,
        }, {
            preserveState: true,
            onSuccess: () => {
                // Task will be refreshed
            }
        });
    };

    const handleStatusUpdate = (newStatus: string) => {
        const formData = new FormData();
        formData.append('status', newStatus);
        formData.append('_method', 'PUT');

        router.post(`/tasks/${task.id}`, formData, {
            preserveState: true,
            onSuccess: () => {
                // Page will be refreshed with new status
            }
        });
    };

    const handleWorkUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        const formData = new FormData();
        if (updateData.current_time_estimate) {
            formData.append('current_time_estimate', updateData.current_time_estimate.toString());
        }
        formData.append('items_completed', updateData.items_completed.toString());
        if (updateData.work_result_image) {
            formData.append('work_result_image', updateData.work_result_image);
        }
        if (updateData.status !== task.status) {
            formData.append('status', updateData.status);
        }
        formData.append('_method', 'PUT');

        router.post(`/tasks/${task.id}`, formData, {
            preserveState: true,
            onSuccess: () => {
                setIsUpdating(false);
                setUpdateData({
                    ...updateData,
                    work_result_image: null,
                });
            },
            onError: () => {
                setIsUpdating(false);
            }
        });
    };

    const canWorkerUpdateStatus = task.taken_by_user?.id === auth.user.id && 
        ['sedang_dikerjakan', 'diterima'].includes(task.status);

    const canManagerReview = userRole === 'manager' && task.status === 'di_tinjau';

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <Link href="/tasks" className="text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
                                ← Back to Tasks
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">{task.name}</h1>
                            <div className="flex items-center space-x-4 mt-2">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[task.status as keyof typeof statusColors]}`}>
                                    {statusLabels[task.status as keyof typeof statusLabels]}
                                </span>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${priorityColors[task.priority_level as keyof typeof priorityColors]}`}>
                                    {priorityLabels[task.priority_level as keyof typeof priorityLabels]}
                                </span>
                            </div>
                        </div>
                        
                        {userRole === 'manager' && task.creator.id === auth.user.id && (
                            <Link href={`/tasks/${task.id}/edit`}>
                                <Button variant="outline">Edit Task</Button>
                            </Link>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Task Image */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                                <img 
                                    src={`/storage/${task.image_path}`}
                                    alt={task.name}
                                    className="w-full h-64 object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDY0MCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2NDAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yODggMTEyTDMzNiAxNjBIMzg0TDMzNiAyMDhIMjg4TDI0MCAxNjBIMjg4VjExMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';
                                    }}
                                />
                                <div className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">{task.description}</p>
                                </div>
                            </div>

                            {/* Work Result */}
                            {task.work_result_image && (
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                                    <div className="p-4 border-b">
                                        <h3 className="font-semibold text-gray-900">Work Result</h3>
                                    </div>
                                    <img 
                                        src={`/storage/${task.work_result_image}`}
                                        alt="Work result"
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                            )}

                            {/* Manager Review Actions */}
                            {canManagerReview && (
                                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Manager Review</h3>
                                    <div className="flex space-x-4">
                                        <Button
                                            onClick={() => handleStatusUpdate('diterima')}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Accept Work
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate('selesai')}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            Mark Complete
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Worker Update Form */}
                            {canUpdate && task.taken_by_user?.id === auth.user.id && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Update Progress</h3>
                                    <form onSubmit={handleWorkUpdate} className="space-y-4">
                                        {/* Time Estimate */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Revised Time Estimate (hours)
                                            </label>
                                            <input
                                                type="number"
                                                value={updateData.current_time_estimate}
                                                onChange={(e) => setUpdateData({ ...updateData, current_time_estimate: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                min="1"
                                            />
                                        </div>

                                        {/* Items Completed */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Items Completed
                                            </label>
                                            <input
                                                type="number"
                                                value={updateData.items_completed}
                                                onChange={(e) => setUpdateData({ ...updateData, items_completed: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                min="0"
                                            />
                                        </div>

                                        {/* Work Result Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Upload Work Result (JPG or PNG)
                                            </label>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => setUpdateData({ ...updateData, work_result_image: e.target.files?.[0] || null })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* Status Update for Worker */}
                                        {canWorkerUpdateStatus && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Status Update
                                                </label>
                                                <select
                                                    value={updateData.status}
                                                    onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    <option value="sedang_dikerjakan">Sedang Dikerjakan</option>
                                                    <option value="di_tinjau">Di Tinjau (Submit for Review)</option>
                                                </select>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="w-full"
                                        >
                                            {isUpdating ? 'Updating...' : 'Update Progress'}
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Take Task Action */}
                            {canTake && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Available Task</h3>
                                    <p className="text-gray-600 mb-4">This task is available to be taken.</p>
                                    <Button 
                                        onClick={handleTakeTask}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        Take This Task
                                    </Button>
                                </div>
                            )}

                            {/* Task Details */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Task Details</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-500">Created by:</span>
                                        <p className="font-medium">{task.creator.name}</p>
                                    </div>
                                    
                                    <div>
                                        <span className="text-sm text-gray-500">Assigned to:</span>
                                        <p className="font-medium">
                                            {task.assignment_type === 'division' 
                                                ? task.assigned_division?.name 
                                                : task.assigned_user?.name}
                                        </p>
                                    </div>
                                    
                                    {task.taken_by_user && (
                                        <div>
                                            <span className="text-sm text-gray-500">Working on:</span>
                                            <p className="font-medium">{task.taken_by_user.name}</p>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <span className="text-sm text-gray-500">Due Date:</span>
                                        <p className="font-medium">{new Date(task.due_date).toLocaleDateString()}</p>
                                    </div>
                                    
                                    <div>
                                        <span className="text-sm text-gray-500">Items Completed:</span>
                                        <p className="font-medium">{task.items_completed}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Time Estimates */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Time Estimates</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-500">Initial Estimates:</span>
                                        <ul className="mt-1">
                                            {task.initial_time_estimates.map((estimate, index) => (
                                                <li key={index} className="text-sm font-medium">
                                                    {estimate} hours
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    {task.current_time_estimate && (
                                        <div>
                                            <span className="text-sm text-gray-500">Current Estimate:</span>
                                            <p className="font-medium">{task.current_time_estimate} hours</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}