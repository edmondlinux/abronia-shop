
import connectDB from '@/config/db';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const careLevel = searchParams.get('careLevel');
        const species = searchParams.get('species');
        const limit = parseInt(searchParams.get('limit')) || 10;
        const page = parseInt(searchParams.get('page')) || 1;

        // Build filter object
        const filter = { isPublished: true };
        
        if (category) filter.category = category;
        if (careLevel) filter.careLevel = careLevel;
        if (species) filter.reptileSpecies = species;

        const skip = (page - 1) * limit;

        const blogPosts = await Blog.find(filter)
            .sort({ publishDate: -1 })
            .skip(skip)
            .limit(limit)
            .select('-author'); // Don't expose author info

        const total = await Blog.countDocuments(filter);

        return NextResponse.json({ 
            success: true, 
            blogPosts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPosts: total
            }
        });

    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
