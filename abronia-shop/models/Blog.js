
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    featuredImage: {
        type: String,
        default: ''
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Care Guides',
            'Species Profiles', 
            'Health & Veterinary',
            'Feeding & Nutrition',
            'Habitat Setup',
            'Breeding',
            'Beginner Tips',
            'Equipment Reviews'
        ]
    },
    tags: [{
        type: String,
        trim: true
    }],
    reptileSpecies: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    careLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    author: {
        type: String,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better search performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ reptileSpecies: 1 });
BlogSchema.index({ publishDate: -1 });

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export default Blog;
