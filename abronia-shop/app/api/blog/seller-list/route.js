
import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Blog from '@/models/Blog';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        await connectDB();

        const blogPosts = await Blog.find({ author: userId })
            .sort({ publishDate: -1 });

        return NextResponse.json({ 
            success: true, 
            blogPosts 
        });

    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
