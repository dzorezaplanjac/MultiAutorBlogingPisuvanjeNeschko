# Multi-Author Blogging Platform - Заплањске приче

A modern multi-author blogging platform built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Secure Authentication**: Powered by Supabase Auth with email/password registration
- **Multi-Author Support**: Different user roles (super_admin, editor, author, reader)
- **Rich Text Editor**: Markdown-based content creation with live preview
- **Responsive Design**: Beautiful, mobile-first design with dark/light theme support
- **Social Sharing**: Built-in sharing for Facebook, Telegram, and general sharing
- **Real-time Updates**: Live updates across the application
- **SEO Optimized**: Dynamic meta tags for better social media sharing

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

1. In your Supabase dashboard, go to the SQL Editor
2. Run the migration file `supabase/migrations/create_profiles_table.sql`
3. This will create:
   - `profiles` table for user management
   - Row Level Security (RLS) policies
   - Automatic profile creation trigger
   - User roles enum

### 3. Authentication Configuration

1. In Supabase dashboard, go to Authentication > Settings
2. Configure the following:
   - **Site URL**: Your application URL (e.g., `http://localhost:5173` for development)
   - **Email confirmation**: Disable for development, enable for production
   - **Email templates**: Customize as needed

### 4. Create Super Admin User

1. In Supabase Auth, manually create your super admin user
2. After creation, update the profiles table with the correct role:

```sql
UPDATE profiles 
SET role = 'super_admin' 
WHERE email = 'your-admin-email@example.com';
```

### 5. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## User Roles

- **super_admin**: Full access to all features, user management
- **editor**: Can manage all posts, moderate content
- **author**: Can create and edit their own posts
- **reader**: Read-only access (default for new registrations)

## Key Features

### Authentication
- Secure registration and login with Supabase Auth
- Password hashing and validation handled by Supabase
- Email confirmation support
- Role-based access control

### Content Management
- Rich markdown editor with live preview
- Image upload support via URL
- Categories and tags
- Draft and published states
- Featured posts

### User Experience
- Responsive design for all devices
- Dark/light theme toggle
- Social media sharing
- SEO-optimized meta tags
- Smooth animations and transitions

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

### profiles table
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `name` (text)
- `role` (enum: super_admin, editor, author, reader)
- `avatar` (text, optional)
- `bio` (text, optional)
- `joined_at` (timestamp)
- `is_active` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data unless they have elevated permissions
- Super admins can manage all users and content
- Secure password handling via Supabase Auth

## Deployment

1. Build the application: `npm run build`
2. Deploy to your preferred hosting platform (Netlify, Vercel, etc.)
3. Set environment variables in your hosting platform
4. Update Supabase Auth settings with your production URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.