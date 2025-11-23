# MCP Calendar - Google Calendar Integration

A full-stack React application that integrates with Google Calendar via Model Context Protocol (MCP) using Composio, providing a modern calendar interface for managing events.

## 🚀 Live Demo

**Live App:** https://mcp-calendar.vercel.app/


## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **FullCalendar** - Calendar component library
- **Tailwind CSS** - Styling and responsive design
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Composio MCP** - Model Context Protocol for Google Calendar integration
- **CORS** - Cross-origin resource sharing

### Deployment
- **Vercel** - Frontend and serverless functions hosting

## 📋 Assumptions & Decisions

### Technical Assumptions
1. **Single Calendar**: App assumes use of primary Google Calendar only
2. **Time Zones**: Uses browser's local timezone for all date/time operations
3. **Event Types**: Focuses on timed events (not all-day events as primary use case)
4. **User Authentication**: Relies on pre-configured Composio entity for Google OAuth

### Product Decisions
1. **Progressive Enhancement**: Clicking dates with existing events shows summary before creation
2. **Mobile-First**: Responsive design optimized for mobile and desktop
3. **Optimistic Updates**: UI updates immediately, then syncs with Google Calendar
4. **Time Picker**: Custom 15-minute interval time selector for better UX

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Google account with Calendar access
- Composio account with Google Calendar app connected

### Local Development

1. **Clone and setup**
```bash
git clone [your-repo-url]
cd mcp-calendar
npm install
```

2. Server setup

```bash
cd server
npm install
Environment configuration
```
```bash
# In server/.env
COMPOSIO_API_KEY=your_composio_api_key
ENTITY_ID=your_entity_id
PORT=3001
Start development servers
```
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend  
cd ..
npm run dev
Access the app
```

Frontend: http://localhost:5173
Backend API: http://localhost:3001
Production Deployment
Build and deploy to Vercel

```bash
npm run build
vercel --prod
```
