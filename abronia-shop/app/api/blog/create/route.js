
import { v2 as cloudinary } from "cloudinary";
import { getAuth } from '@clerk/nextjs/server';
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Blog from "@/models/Blog";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        const formData = await request.formData();

        const title = formData.get('title');
        const slug = formData.get('slug');
        const content = formData.get('content');
        const excerpt = formData.get('excerpt');
        const category = formData.get('category');
        const tagsString = formData.get('tags');
        const reptileSpecies = formData.get('reptileSpecies');
        const metaDescription = formData.get('metaDescription');
        const careLevel = formData.get('careLevel');
        const featuredImageFile = formData.get('featuredImage');

        // Parse tags
        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        let featuredImageUrl = '';

        // Upload featured image if provided
        if (featuredImageFile && featuredImageFile.size > 0) {
            const arrayBuffer = await featuredImageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'blog-images'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            featuredImageUrl = result.secure_url;
        }

        await connectDB();

        // Check if slug already exists
        const existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
            return NextResponse.json({ success: false, message: 'Slug already exists' });
        }

        const blogPost = new Blog({
            title,
            slug,
            content,
            excerpt,
            category,
            tags,
            reptileSpecies,
            metaDescription,
            careLevel,
            featuredImage: featuredImageUrl,
            author: userId
        });

        await blogPost.save();

        return NextResponse.json({ 
            success: true, 
            message: 'Blog post created successfully',
            blogPost 
        });

    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
