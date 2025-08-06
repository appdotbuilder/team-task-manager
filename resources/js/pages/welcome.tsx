import React from 'react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Props {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    const user = auth?.user;

    if (user) {
        // Authenticated user sees the dashboard
        return (
            <AppLayout>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
                    <div className="container mx-auto px-4">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                👥 Team Management Dashboard
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Welcome back, <strong>{user.name}</strong>! Manage your projects, track tasks, 
                                and collaborate with your team efficiently.
                            </p>
                        </div>

                        {/* Role-based quick actions */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {user.role === 'administrator' && (
                                <>
                                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                                👨‍💼
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
                                                <p className="text-gray-600 text-sm">Manage user roles and permissions</p>
                                            </div>
                                        </div>
                                        <Link href="/users">
                                            <Button className="w-full">Manage Users</Button>
                                        </Link>
                                    </div>
                                    
                                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-green-100 p-3 rounded-lg mr-4">
                                                🏢
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">Divisions</h3>
                                                <p className="text-gray-600 text-sm">Create and manage divisions</p>
                                            </div>
                                        </div>
                                        <Link href="/divisions">
                                            <Button className="w-full">Manage Divisions</Button>
                                        </Link>
                                    </div>
                                </>
                            )}
                            
                            {user.role === 'manager' && (
                                <>
                                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                                ➕
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">Create Task</h3>
                                                <p className="text-gray-600 text-sm">Create new projects and tasks</p>
                                            </div>
                                        </div>
                                        <Link href="/tasks/create">
                                            <Button className="w-full">Create New Task</Button>
                                        </Link>
                                    </div>
                                    
                                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-orange-100 p-3 rounded-lg mr-4">
                                                📋
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">My Tasks</h3>
                                                <p className="text-gray-600 text-sm">Review and manage your tasks</p>
                                            </div>
                                        </div>
                                        <Link href="/tasks">
                                            <Button className="w-full">View My Tasks</Button>
                                        </Link>
                                    </div>
                                </>
                            )}
                            
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                                <div className="flex items-center mb-4">
                                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                                        📊
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Task Board</h3>
                                        <p className="text-gray-600 text-sm">View all available tasks</p>
                                    </div>
                                </div>
                                <Link href="/tasks">
                                    <Button className="w-full">View Tasks</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Features overview */}
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                🚀 Key Features
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        📝
                                    </div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Task Creation</h3>
                                    <p className="text-gray-600 text-sm">Managers can create detailed tasks with images and estimates</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        👥
                                    </div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Team Assignment</h3>
                                    <p className="text-gray-600 text-sm">Assign tasks to divisions or individual users</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        🔄
                                    </div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Workflow Tracking</h3>
                                    <p className="text-gray-600 text-sm">Track progress through defined workflow stages</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        📊
                                    </div>
                                    <h3 className="font-semibold text-gray-808 mb-2">Progress Monitoring</h3>
                                    <p className="text-gray-600 text-sm">Monitor completion rates and work results</p>
                                </div>
                            </div>
                        </div>

                        {/* Workflow explanation */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white p-8">
                            <h2 className="text-2xl font-bold mb-6 text-center">
                                ⚡ Task Workflow
                            </h2>
                            <div className="flex flex-wrap justify-center items-center gap-4">
                                <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center min-w-[120px]">
                                    <div className="text-2xl mb-2">🆕</div>
                                    <div className="font-medium">Belum Dimulai</div>
                                </div>
                                <div className="text-2xl">→</div>
                                <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center min-w-[120px]">
                                    <div className="text-2xl mb-2">🔄</div>
                                    <div className="font-medium">Sedang Dikerjakan</div>
                                </div>
                                <div className="text-2xl">→</div>
                                <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center min-w-[120px]">
                                    <div className="text-2xl mb-2">👀</div>
                                    <div className="font-medium">Di Tinjau</div>
                                </div>
                                <div className="text-2xl">→</div>
                                <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center min-w-[120px]">
                                    <div className="text-2xl mb-2">✅</div>
                                    <div className="font-medium">Selesai</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Guest user sees the marketing page
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl">👥</div>
                            <span className="text-xl font-bold text-gray-800">TeamFlow</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link href="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        🚀 Team Management Made Simple
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Streamline your team's workflow with our comprehensive task management system. 
                        Create, assign, and track projects with advanced role-based permissions.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link href="/register">
                            <Button size="lg" className="px-8">Start Free Trial</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="px-8">Login</Button>
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            👨‍💼
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Role-Based Access</h3>
                        <p className="text-gray-600">Administrators, Managers, Division Members, and Individual Users with specific permissions.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            📸
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Visual Task Management</h3>
                        <p className="text-gray-600">Upload images for tasks and work results. Visual thumbnails make tracking easier.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            ⏱️
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Time Estimation</h3>
                        <p className="text-gray-600">Provide initial estimates and allow workers to propose revisions for better accuracy.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            🔄
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Workflow Management</h3>
                        <p className="text-gray-600">Structured workflow from creation to completion with review cycles.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            📊
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Progress Tracking</h3>
                        <p className="text-gray-600">Track items completed, monitor deadlines, and prioritize tasks effectively.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            🎯
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Assignment</h3>
                        <p className="text-gray-600">Assign tasks to entire divisions or specific users based on your needs.</p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Team Management?</h2>
                    <p className="text-xl mb-8 opacity-90">Join thousands of teams already using TeamFlow to streamline their workflow.</p>
                    <Link href="/register">
                        <Button size="lg" variant="outline" className="bg-white text-indigo-600 hover:bg-gray-100 px-8">
                            Start Your Free Trial Today
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}