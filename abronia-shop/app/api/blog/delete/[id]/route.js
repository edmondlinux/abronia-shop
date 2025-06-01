
import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Blog from '@/models/Blog';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        await connectDB();

        const blogPost = await Blog.findById(params.id);

        if (!blogPost) {
            return NextResponse.json({ success: false, message: 'Blog post not found' });
        }

        // Check if the seller is the author of the blog post
        if (blogPost.author !== userId) {
            return NextResponse.json({ success: false, message: 'Not authorized to delete this post' });
        }

        await Blog.findByIdAndDelete(params.id);

        return NextResponse.json({ 
            success: true, 
            message: 'Blog post deleted successfully' 
        });

    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
