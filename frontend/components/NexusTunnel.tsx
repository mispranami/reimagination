'use client'

import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface Game {
  id: string
  name: string
  description: string
  accentColor: string
  imageSrc: string
  stats: {
    active_players: string
    win_rate: string
    current_patch: string
  }
  media: {
    hero_image: string
    background_logo: string
  }
}

interface GameSectionProps {
  game: Game
  index: number
  scrollYProgress: MotionValue<number>
}

function GameSection({ game, index, scrollYProgress }: GameSectionProps) {
  // Manual mapping for each card
  const scrollRanges = [
    { start: 0, end: 0.25 },      // Card 1
    { start: 0.25, end: 0.5 },    // Card 2
    { start: 0.5, end: 0.75 },    // Card 3
    { start: 0.75, end: 1 }       // Card 4
  ]
  
  const range = scrollRanges[index] || scrollRanges[0]
  
  // Z-axis: -3000 to 0, clamped
  const z = useTransform(
    scrollYProgress,
    [range.start, range.end],
    [-3000, 0],
    { clamp: true }
  )
  
  // Hard opacity: only visible during this card's range
  const opacity = useTransform(
    scrollYProgress,
    [range.start - 0.01, range.start, range.end, range.end + 0.01],
    [0, 1, 1, 0],
    { clamp: true }
  )
  
  // Blur: distant cards are blurred
  const blur = useTransform(
    z,
    [-3000, -1500, 0],
    [15, 5, 0],
    { clamp: true }
  )
  
  // Scale: grow from 0.5 to 1 as it approaches
  const scale = useTransform(
    scrollYProgress,
    [range.start, range.end],
    [0.5, 1],
    { clamp: true }
  )

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        translateZ: z,
        opacity,
        filter: useTransform(blur, (b) => `blur(${b}px)`),
        scale,
        transformStyle: 'preserve-3d'
      }}
    >
      <div 
        className="relative w-[80vw] h-[70vh] rounded-3xl overflow-hidden shadow-2xl"
        style={{ 
          border: `2px solid ${game.accentColor}`
        }}
      >
        {/* Background Image */}
        <img 
          src={game.imageSrc} 
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        
        {/* Content */}
        <div className="relative h-full p-12 flex flex-col justify-center items-center text-center">
          <h2 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">{game.name}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl drop-shadow-md">{game.description}</p>
          <div className="flex gap-8 text-white">
            <div>
              <p className="text-sm opacity-80">Active Players</p>
              <p className="text-3xl font-bold">{game.stats.active_players}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Win Rate</p>
              <p className="text-3xl font-bold">{game.stats.win_rate}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Patch</p>
              <p className="text-3xl font-bold">{game.stats.current_patch}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface NexusTunnelProps {
  setActiveGame: (game: Game | null) => void
}

export default function NexusTunnel({ setActiveGame }: NexusTunnelProps) {
  const [games, setGames] = useState<Game[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const fetchGames = () => {
    fetch('http://localhost:5001/api/games')
      .then(res => res.json())
      .then(data => setGames(data.games))
      .catch(err => console.error('Failed to fetch games:', err))
  }

  useEffect(() => {
    // Initial fetch
    fetchGames()
    
    // Refresh every 5 seconds for dynamic stats
    const interval = setInterval(fetchGames, 5000)
    
    return () => clearInterval(interval)
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (games.length === 0) return

    // Determine which card is active based on scroll position
    if (latest < 0.25) {
      setActiveGame(games[0])
    } else if (latest < 0.5) {
      setActiveGame(games[1])
    } else if (latest < 0.75) {
      setActiveGame(games[2])
    } else {
      setActiveGame(games[3])
    }
  })

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden perspective-stage">
        <div className="absolute inset-0 bg-transparent">
          {games.map((game, index) => (
            <GameSection
              key={game.id}
              game={game}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
