import React from 'react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Division {
    id: number;
    name: string;
    description: string | null;
    users_count: number;
    created_at: string;
}

interface Props {
    divisions: {
        data: Division[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
    };
    [key: string]: unknown;
}

export default function DivisionsIndex({ divisions }: Props) {
    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">🏢 Division Management</h1>
                        <p className="text-gray-600 mt-2">Manage organizational divisions and teams</p>
                    </div>
                    <Link href="/divisions/create">
                        <Button>Create New Division</Button>
                    </Link>
                </div>

                {/* Divisions Grid */}
                {divisions.data.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏢</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No divisions found</h3>
                        <p className="text-gray-500">Create your first division to organize your teams.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {divisions.data.map((division) => (
                                <div key={division.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    <div className="p-6">
                                        {/* Division Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="bg-indigo-100 p-3 rounded-lg">
                                                <span className="text-2xl">🏢</span>
                                            </div>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                                {division.users_count} members
                                            </span>
                                        </div>

                                        {/* Division Name */}
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {division.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {division.description || 'No description provided'}
                                        </p>

                                        {/* Created Date */}
                                        <p className="text-xs text-gray-500 mb-4">
                                            Created {new Date(division.created_at).toLocaleDateString()}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex space-x-2">
                                            <Link href={`/divisions/${division.id}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    View Details
                                                </Button>
                                            </Link>
                                            <Link href={`/divisions/${division.id}/edit`}>
                                                <Button size="sm" variant="outline">
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {divisions.last_page > 1 && (
                            <div className="flex justify-center">
                                <nav className="flex space-x-2">
                                    {divisions.links.map((link, index) => (
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