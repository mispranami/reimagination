# Riot Nexus

A next-generation immersive discovery engine that reimagines the Riot Games landing page through spatial computing and scroll-linked 3D interactions.

## System Design Overview

Riot Nexus transforms traditional game portfolio browsing into a cinematic journey through virtual space. By leveraging scroll-based parallax and depth-of-field effects, users navigate a 3D tunnel where each Riot game exists as a spatial layer—distant games appear blurred and faint, while the focused game emerges sharp and vibrant at the optimal viewing plane (z: 0).

### Architecture

**Frontend (Next.js 14 + Framer Motion)**
- App Router architecture for optimal performance
- Scroll-linked 3D transformations using `useScroll` and `useTransform`
- Real-time depth-of-field simulation with dynamic blur and opacity
- Glassmorphic HUD with live data synchronization
- Cinematic noise overlay for film-grade aesthetics

**Backend (Node.js + Express)**
- RESTful API serving structured game data
- CORS-enabled for seamless frontend integration
- JSON-based data store with rich metadata (stats, media, branding)
- Scalable architecture ready for database integration

### Key Features

1. **3D Spatial Navigation**: Games translate along the Z-axis (-4000px to 400px) as users scroll, creating an illusion of depth and movement through virtual space.

2. **Depth-of-Field Engine**: Implements cinematic focus effects where distant objects blur (20px) and fade (10% opacity), while focused content remains crystal clear.

3. **Live Dashboard HUD**: Fixed glassmorphic overlay displays real-time stats for the currently focused game, with smooth AnimatePresence transitions between game switches.

4. **Scroll-Linked State Management**: Uses `useMotionValueEvent` to calculate which game is closest to the focal plane, dynamically updating the active game context.

5. **Cinematic Polish**: Animated grain texture, pulsing "LIVE" indicators, and staggered stat animations create a premium, AAA-quality experience.

## Project Structure

```
/backend
  ├── server.js          # Express API server (port 5001)
  ├── data.json          # Game metadata and stats
  └── package.json       # Node dependencies

/frontend
  ├── app/
  │   ├── page.tsx       # Main application entry
  │   ├── layout.tsx     # Root layout with metadata
  │   └── globals.css    # Global styles + noise overlay
  ├── components/
  │   ├── NexusTunnel.tsx    # 3D scroll tunnel engine
  │   └── DashboardHUD.tsx   # Live stats overlay
  └── package.json       # Next.js + Framer Motion
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs at `http://localhost:5001`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Application runs at `http://localhost:3000`

## Technical Highlights

- **Framer Motion**: Advanced scroll-linked animations with `useScroll`, `useTransform`, and `useMotionValueEvent`
- **TypeScript**: Full type safety across components and API contracts
- **Tailwind CSS**: Utility-first styling with custom glassmorphism effects
- **CSS 3D Transforms**: Hardware-accelerated perspective and translateZ for smooth 60fps animations
- **RESTful API Design**: Clean separation of concerns with scalable backend architecture

## Future Enhancements

- WebGL particle systems for enhanced visual effects
- Real-time data streaming via WebSockets
- User interaction tracking and analytics
- Mobile-optimized touch gestures
- Database integration (PostgreSQL/MongoDB)
- CDN-hosted media assets

---

Built with Next.js 14, Framer Motion, Express, and a passion for pushing the boundaries of web experiences.
