
import connectDB from '@/config/db';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await connectDB();

        const blogPost = await Blog.findOne({ 
            slug: params.slug, 
            isPublished: true 
        }).select('-author');

        if (!blogPost) {
            return NextResponse.json({ success: false, message: 'Blog post not found' });
        }

        return NextResponse.json({ 
            success: true, 
            blogPost 
        });

    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
