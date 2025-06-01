
'use client';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import Link from 'next/link';

const BlogList = () => {
    const { router } = useAppContext();
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        careLevel: '',
        species: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0
    });

    const categories = [
        'Care Guides',
        'Species Profiles', 
        'Health & Veterinary',
        'Feeding & Nutrition',
        'Habitat Setup',
        'Breeding',
        'Beginner Tips',
        'Equipment Reviews'
    ];

    const careLevels = ['beginner', 'intermediate', 'advanced'];

    const fetchBlogPosts = async (page = 1) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '9'
            });

            if (filters.category) queryParams.append('category', filters.category);
            if (filters.careLevel) queryParams.append('careLevel', filters.careLevel);
            if (filters.species) queryParams.append('species', filters.species);

            const response = await fetch(`/api/blog/list?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                setBlogPosts(data.blogPosts);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogPosts();
    }, [filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
        fetchBlogPosts(newPage);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading blog posts...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Reptile Care Blog
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Expert guides and tips for reptile care, from beginner basics to advanced breeding techniques
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Care Level
                            </label>
                            <select
                                value={filters.careLevel}
                                onChange={(e) => handleFilterChange('careLevel', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">All Levels</option>
                                {careLevels.map(level => (
                                    <option key={level} value={level}>
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Species
                            </label>
                            <input
                                type="text"
                                value={filters.species}
                                onChange={(e) => handleFilterChange('species', e.target.value)}
                                placeholder="e.g. Bearded Dragon"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Blog Posts Grid */}
                {blogPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <article key={post._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {post.featuredImage && (
                                    <div className="aspect-w-16 aspect-h-9">
                                        <Image
                                            src={post.featuredImage}
                                            alt={post.title}
                                            width={400}
                                            height={225}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                )}
                                
                                <div className="p-6">
                                    <div className="flex items-center mb-3">
                                        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-2">
                                            {post.category}
                                        </span>
                                        {post.careLevel && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {post.careLevel}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {post.title}
                                    </h2>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <time className="text-gray-500 text-sm">
                                            {formatDate(post.publishDate)}
                                        </time>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                                        >
                                            Read More →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                        <nav className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            
                            {[...Array(pagination.totalPages)].map((_, index) => {
                                const page = index + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 rounded-md ${
                                            pagination.currentPage === page
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
