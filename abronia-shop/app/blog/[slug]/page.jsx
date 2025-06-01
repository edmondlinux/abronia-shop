
'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import Link from 'next/link';

const BlogPost = () => {
    const params = useParams();
    const { router } = useAppContext();
    const [blogPost, setBlogPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/blog/${params.slug}`);
                const data = await response.json();

                if (data.success) {
                    setBlogPost(data.blogPost);
                } else {
                    setError(data.message || 'Blog post not found');
                }
            } catch (error) {
                console.error('Error fetching blog post:', error);
                setError('Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchBlogPost();
        }
    }, [params.slug]);

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
                <div className="text-xl">Loading blog post...</div>
            </div>
        );
    }

    if (error || !blogPost) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {error || 'Blog post not found'}
                    </h1>
                    <Link
                        href="/blog"
                        className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4"
                    >
                        ← Back to Blog
                    </Link>
                </div>
            </div>

            {/* Article */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Featured Image */}
                    {blogPost.featuredImage && (
                        <div className="aspect-w-16 aspect-h-9">
                            <Image
                                src={blogPost.featuredImage}
                                alt={blogPost.title}
                                width={800}
                                height={450}
                                className="w-full h-64 md:h-96 object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className="inline-block bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                                {blogPost.category}
                            </span>
                            {blogPost.careLevel && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                    {blogPost.careLevel.charAt(0).toUpperCase() + blogPost.careLevel.slice(1)}
                                </span>
                            )}
                            {blogPost.reptileSpecies && (
                                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                                    {blogPost.reptileSpecies}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {blogPost.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex items-center text-gray-500 text-sm mb-8 pb-8 border-b border-gray-200">
                            <time dateTime={blogPost.publishDate}>
                                Published on {formatDate(blogPost.publishDate)}
                            </time>
                            {blogPost.tags && blogPost.tags.length > 0 && (
                                <div className="ml-6">
                                    <span className="mr-2">Tags:</span>
                                    {blogPost.tags.map((tag, index) => (
                                        <span key={tag} className="text-orange-600">
                                            {tag}
                                            {index < blogPost.tags.length - 1 && ', '}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Excerpt */}
                        {blogPost.excerpt && (
                            <div className="text-lg text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                                {blogPost.excerpt}
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose prose-lg max-w-none">
                            <div
                                className="text-gray-800 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: blogPost.content }}
                            />
                        </div>

                        {/* Tags */}
                        {blogPost.tags && blogPost.tags.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {blogPost.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center justify-center px-6 py-3 border border-orange-600 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-colors"
                    >
                        View All Blog Posts
                    </Link>
                </div>
            </article>
        </div>
    );
};

export default BlogPost;
