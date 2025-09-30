# Index - Tool Discovery Platform
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

A modern, responsive tool discovery platform built with Next.js 14, TypeScript, and Supabase. Discover, submit, and review amazing tools across various categories with a beautiful, user-friendly interface.

## 🚀 Live Demo
**[https://index-tools.vercel.app)**

## ✨ Features

### Core Functionality
- **Tool Discovery**: Browse and search through a curated collection of tools
- **Advanced Filtering**: Filter by category, pricing, rating, and more
- **Tool Submission**: Submit new tools with detailed information and screenshots
- **User Reviews**: Rate and review tools with a 5-star rating system
- **Community Features**: Community posts, discussions, and comments
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Responsive Design**: Fully responsive with mobile-first approach

### User Experience
- **Dark Theme**: Beautiful dark theme with smooth transitions
- **Search & Discovery**: Intelligent search with real-time results
- **Daily Features**: Curated daily tool recommendations
- **Tool Categories**: Organized by AI/ML, Analytics, Design, Development, etc.
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Image Optimization**: Smart image loading with fallbacks

### Technical Features
- **Server-Side Rendering**: Next.js 14 with App Router
- **Database Integration**: PostgreSQL with Supabase
- **Real-time Updates**: Live data synchronization
- **File Uploads**: Image upload for tools and community posts
- **SEO Optimized**: Meta tags and structured data
- **Performance**: Optimized loading and caching

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for images
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Greatness0123/index-clone.git
cd index-clone
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Variables
Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nlpbzpclmvllynvefiqb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Database Configuration
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=postgres
POSTGRES_HOST=your_host

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

### 4. Database Setup
Run the SQL scripts in the `scripts/` folder to set up your database:

\`\`\`bash
# Run these scripts in your Supabase SQL editor in order:
 1. scripts/36-comprehensive-database-fixes.sql
 2. scripts/37-populate-missing-tool-images.sql
\`\`\`

### 5. Start Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 🗄 Database Schema

### Core Tables
- **tools**: Main tool information (name, description, URL, category, etc.)
- **categories**: Tool categories with colors and icons
- **users**: User profiles and authentication data
- **comments**: Tool reviews and ratings
- **tool_stats**: Aggregated statistics (views, clicks, favorites)

### Community Tables
- **community_posts**: Community discussions and posts
- **community_comments**: Comments on community posts
- **community_post_likes**: Like system for posts
- **community_comment_likes**: Like system for comments

### Relationship Tables
- **tool_tags**: Many-to-many relationship between tools and tags
- **user_favorites**: User's favorite tools
- **tool_views**: Tool view tracking
- **tool_clicks**: Tool click tracking

## 🔧 Recent Fixes & Improvements

### Database & Backend Fixes
- ✅ **Fixed RLS Policies**: Resolved Row Level Security policy violations
- ✅ **Fixed Ambiguous Column References**: Eliminated database query conflicts
- ✅ **Created Safe Database Functions**: Implemented `update_tool_statistics_safe` and `track_tool_click_safe`
- ✅ **Storage Bucket Configuration**: Set up public storage buckets for images
- ✅ **Database Triggers**: Auto-update tool statistics on data changes

### Frontend Improvements
- ✅ **Responsive Header**: Added hamburger menu for mobile devices
- ✅ **Image Loading**: Improved tool image display with proper fallbacks
- ✅ **Error Handling**: Better error states and user feedback
- ✅ **Mobile Optimization**: Enhanced mobile user experience
- ✅ **Loading States**: Added loading indicators throughout the app

### Performance Optimizations
- ✅ **Image Optimization**: Smart image loading with CDN fallbacks
- ✅ **Database Indexing**: Optimized queries for better performance
- ✅ **Caching Strategy**: Implemented proper caching for static data
- ✅ **Bundle Optimization**: Reduced bundle size and improved loading times

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px (Hamburger menu, stacked layout)
- **Tablet**: 768px - 1024px (Condensed layout)
- **Desktop**: > 1024px (Full layout with sidebar)

## 🔐 Authentication & Security

- **Supabase Auth**: Secure email/password authentication
- **Row Level Security**: Database-level security policies
- **Protected Routes**: Server-side authentication checks
- **CSRF Protection**: Built-in Next.js security features
- **Input Validation**: Client and server-side validation

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 📊 Features Overview

### For Users
- Browse and discover tools across multiple categories
- Search tools with intelligent filtering
- Read and write reviews with star ratings
- Create user profiles and manage favorites
- Participate in community discussions
- Submit new tools for review

### For Administrators
- Approve/reject submitted tools
- Moderate community content
- View analytics and statistics
- Manage categories and tags
- User management capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database and auth by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/index-clone/issues) page
2. Create a new issue with detailed information
3. Contact support at [vercel.com/help](https://vercel.com/help)

