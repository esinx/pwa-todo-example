# PWA Todo App

A Progressive Web App (PWA) shared Todo list built with React, Vite, Supabase, and service workers for offline functionality. **No sign-up required** - it's a collaborative todo list that anyone can use!

## Features

- ✅ **Progressive Web App** - Installable on mobile and desktop
- 🚀 **Offline Support** - Works without internet connection using service workers
- 💾 **Local Storage** - Caches todos locally for instant loading
- 🔄 **Auto Sync** - Syncs with Supabase when connection is restored
- 📱 **Responsive Design** - Works on all device sizes
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components
- 🌍 **Shared & Anonymous** - No authentication required, collaborative todo list

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **PWA**: Vite PWA Plugin with Workbox
- **Offline**: Service Workers + LocalStorage

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Update `src/core/supabase.ts` with your credentials
4. Run the SQL schema in `database-schema.sql` in your Supabase SQL editor

### 3. Configure Environment (Optional)

Create a `.env` file if you want to use environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then update `src/core/supabase.ts` to use these variables.

### 4. Run Development Server

```bash
pnpm dev
```

### 5. Build for Production

```bash
pnpm build
```

## PWA Features

### Service Worker

The app uses Workbox for service worker functionality:
- **NetworkFirst** strategy for Supabase API calls
- **CacheFirst** for static assets
- Automatic updates when new versions are deployed

### Offline Functionality

- Todos are cached in localStorage
- All CRUD operations work offline
- Changes sync automatically when connection is restored
- Optimistic updates for better UX

### Installation

Users can install the app:
- **Mobile**: Add to Home Screen
- **Desktop**: Install button in browser
- **Chromium**: Automatic install prompt

## Anonymous Access

This app is designed for **anonymous collaborative use**:
- No user authentication required
- Everyone shares the same todo list
- Perfect for teams, families, or public use
- All todos are visible to all users
- Uses only Supabase's anonymous key

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── AddTodo.tsx     # Add todo form
│   ├── TodoItem.tsx    # Individual todo item
│   └── TodoList.tsx    # Todo list with filtering
├── hooks/              # Custom React hooks
│   └── useTodos.ts     # Todo operations hook
├── core/               # Core configuration
│   └── supabase.ts     # Supabase client
├── types/              # TypeScript type definitions
│   └── supabase-types.ts
├── lib/                # Utility functions
└── main.tsx           # App entry point
```

## Development

### Adding New Features

1. **Database Changes**: Update `database-schema.sql` and apply to Supabase
2. **Types**: Update `src/types/supabase-types.ts`
3. **API**: Modify `src/hooks/useTodos.ts`
4. **UI**: Add/modify components in `src/components/`

### Testing PWA Features

1. Build the app: `pnpm build`
2. Serve locally: `pnpm preview`
3. Test in incognito mode for clean state
4. Use browser dev tools to simulate offline

### Icons

Replace the placeholder icons in `public/` with proper PWA icons:
- `pwa-192x192.png`
- `pwa-512x512.png`
- `favicon.ico`

## Deployment

The app can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your GitHub repository
- **GitHub Pages**: Enable in repository settings

Make sure to update your Supabase project settings to allow your production domain.

## Security Considerations

Since this app uses anonymous access:
- Consider implementing rate limiting in Supabase
- Monitor usage to prevent abuse
- Add content moderation if needed
- Consider adding simple spam protection

## Browser Support

- Chrome/Edge: Full PWA support
- Firefox: Service workers + partial install
- Safari: Service workers (iOS 14.3+)

## License

MIT License - feel free to use this project as a starting point for your own PWA applications.
