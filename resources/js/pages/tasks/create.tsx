import React, { useState } from 'react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Division {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    divisions: Division[];
    users: User[];
    [key: string]: unknown;
}

export default function CreateTask({ divisions, users }: Props) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null as File | null,
        due_date: '',
        priority_level: 'medium',
        assignment_type: 'division',
        assigned_division_id: '',
        assigned_user_id: '',
        initial_time_estimates: ['', '']
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        if (formData.image) {
            submitData.append('image', formData.image);
        }
        submitData.append('due_date', formData.due_date);
        submitData.append('priority_level', formData.priority_level);
        submitData.append('assignment_type', formData.assignment_type);
        
        if (formData.assignment_type === 'division') {
            submitData.append('assigned_division_id', formData.assigned_division_id);
        } else {
            submitData.append('assigned_user_id', formData.assigned_user_id);
        }

        // Add time estimates
        formData.initial_time_estimates.forEach((estimate, index) => {
            if (estimate) {
                submitData.append(`initial_time_estimates[${index}]`, estimate);
            }
        });

        router.post('/tasks', submitData, {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            }
        });
    };

    const addTimeEstimate = () => {
        if (formData.initial_time_estimates.length < 3) {
            setFormData({
                ...formData,
                initial_time_estimates: [...formData.initial_time_estimates, '']
            });
        }
    };

    const removeTimeEstimate = (index: number) => {
        if (formData.initial_time_estimates.length > 2) {
            const newEstimates = formData.initial_time_estimates.filter((_, i) => i !== index);
            setFormData({
                ...formData,
                initial_time_estimates: newEstimates
            });
        }
    };

    const updateTimeEstimate = (index: number, value: string) => {
        const newEstimates = [...formData.initial_time_estimates];
        newEstimates[index] = value;
        setFormData({
            ...formData,
            initial_time_estimates: newEstimates
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">➕ Create New Task</h1>
                        <p className="text-gray-600 mt-2">Create a new task and assign it to your team</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
                        {/* Task Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Task Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter task name"
                                required
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={4}
                                placeholder="Describe the task in detail"
                                required
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Task Image * (JPG or PNG)
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                            )}
                        </div>

                        {/* Due Date and Priority */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Due Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                {errors.due_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority Level *
                                </label>
                                <select
                                    value={formData.priority_level}
                                    onChange={(e) => setFormData({ ...formData, priority_level: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        {/* Assignment Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assignment Type *
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="division"
                                        checked={formData.assignment_type === 'division'}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            assignment_type: e.target.value,
                                            assigned_user_id: '' 
                                        })}
                                        className="mr-2"
                                    />
                                    Division
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="user"
                                        checked={formData.assignment_type === 'user'}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            assignment_type: e.target.value,
                                            assigned_division_id: '' 
                                        })}
                                        className="mr-2"
                                    />
                                    Specific User
                                </label>
                            </div>
                        </div>

                        {/* Assignment Target */}
                        {formData.assignment_type === 'division' ? (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Division *
                                </label>
                                <select
                                    value={formData.assigned_division_id}
                                    onChange={(e) => setFormData({ ...formData, assigned_division_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select a division</option>
                                    {divisions.map((division) => (
                                        <option key={division.id} value={division.id}>
                                            {division.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.assigned_division_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.assigned_division_id}</p>
                                )}
                            </div>
                        ) : (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select User *
                                </label>
                                <select
                                    value={formData.assigned_user_id}
                                    onChange={(e) => setFormData({ ...formData, assigned_user_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.role})
                                        </option>
                                    ))}
                                </select>
                                {errors.assigned_user_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.assigned_user_id}</p>
                                )}
                            </div>
                        )}

                        {/* Time Estimates */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Initial Time Estimates (hours) *
                            </label>
                            <p className="text-sm text-gray-500 mb-3">Provide 2-3 initial time estimates</p>
                            
                            {formData.initial_time_estimates.map((estimate, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="number"
                                        value={estimate}
                                        onChange={(e) => updateTimeEstimate(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder={`Estimate ${index + 1}`}
                                        min="1"
                                        required
                                    />
                                    {formData.initial_time_estimates.length > 2 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="ml-2"
                                            onClick={() => removeTimeEstimate(index)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            
                            {formData.initial_time_estimates.length < 3 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addTimeEstimate}
                                >
                                    Add Estimate
                                </Button>
                            )}
                            
                            {errors.initial_time_estimates && (
                                <p className="text-red-500 text-sm mt-1">{errors.initial_time_estimates}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/tasks')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Task'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}