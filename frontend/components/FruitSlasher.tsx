'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

interface Fruit {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  type: 'apple' | 'orange' | 'watermelon' | 'banana' | 'bomb'
  rotation: number
  rotationSpeed: number
  size: number
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
}

interface SliceTrail {
  x: number
  y: number
}

export default function FruitSlasher() {
  const [isActive, setIsActive] = useState(false)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle')
  const [score, setScore] = useState(0)
  const [fruitsSliced, setFruitsSliced] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [sliceTrail, setSliceTrail] = useState<SliceTrail[]>([])
  const [isSlicing, setIsSlicing] = useState(false)
  const [insaneMode, setInsaneMode] = useState(false)
  
  const canvasRef = useRef<HTMLDivElement>(null)
  const fruitIdRef = useRef(0)
  const particleIdRef = useRef(0)
  const gameLoopRef = useRef<number>()
  const spawnIntervalRef = useRef<NodeJS.Timeout>()
  const comboTimeoutRef = useRef<NodeJS.Timeout>()
  const keySequence = useRef<string[]>([])
  const lastKeyTime = useRef<number>(0)

  const fruitColors = {
    apple: '#ff4444',
    orange: '#ff8800',
    watermelon: '#44ff44',
    banana: '#ffff44',
    bomb: '#333333'
  }

  // Secret activation: P M
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const now = Date.now()
      
      if (now - lastKeyTime.current > 2000) {
        keySequence.current = []
      }
      
      lastKeyTime.current = now
      keySequence.current.push(key)
      
      if (keySequence.current.length > 5) {
        keySequence.current.shift()
      }
      
      // Check for PM sequence to activate game
      if (keySequence.current.join('') === 'pm') {
        setIsActive(true)
        keySequence.current = []
      }
      
      // Check for NINJA sequence for insane mode
      if (keySequence.current.join('') === 'ninja') {
        setInsaneMode(true)
        keySequence.current = []
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setFruitsSliced(0)
    setCombo(0)
    setTimeLeft(20)
    setFruits([])
    setParticles([])
    spawnFruit()
  }

  const spawnFruit = () => {
    const types: Array<'apple' | 'orange' | 'watermelon' | 'banana' | 'bomb'> = 
      ['apple', 'orange', 'watermelon', 'banana']
    
    // 15% chance for bomb
    const isBomb = Math.random() < 0.15
    const type = isBomb ? 'bomb' : types[Math.floor(Math.random() * types.length)]
    
    const spawnX = Math.random() * 80 + 10
    const targetX = Math.random() * 60 + 20
    const vx = (targetX - spawnX) * (insaneMode ? 0.008 : 0.005)
    const vy = insaneMode ? -(Math.random() * 10 + 12) : -(Math.random() * 8 + 10)
    
    const newFruit: Fruit = {
      id: fruitIdRef.current++,
      x: spawnX,
      y: 100,
      vx,
      vy,
      type,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 5,
      size: type === 'bomb' ? 40 : 50
    }
    
    setFruits(prev => [...prev, newFruit])
  }

  const sliceFruit = (fruitId: number, sliceX: number, sliceY: number) => {
    setFruits(prev => {
      const fruit = prev.find(f => f.id === fruitId)
      if (!fruit) return prev
      
      if (fruit.type === 'bomb') {
        // Bomb hit - instant fail
        endGame()
        createExplosion(fruit.x, fruit.y)
        return []
      }
      
      // Successful slice
      setFruitsSliced(f => f + 1)
      setScore(s => s + (10 * Math.max(1, combo)))
      setCombo(c => c + 1)
      
      // Reset combo after 1 second
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current)
      comboTimeoutRef.current = setTimeout(() => setCombo(0), 1000)
      
      createJuiceSplash(fruit.x, fruit.y, fruitColors[fruit.type])
      
      // Check win condition
      if (fruitsSliced + 1 >= 10) {
        setTimeout(() => endGame(), 100)
      }
      
      return prev.filter(f => f.id !== fruitId)
    })
  }

  const createJuiceSplash = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15
      const speed = Math.random() * 5 + 3
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 1
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }

  const createExplosion = (x: number, y: number) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30
      const speed = Math.random() * 8 + 5
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#ff4444',
        life: 1
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }

  // Mouse/Touch handling
  const handlePointerDown = (e: React.PointerEvent) => {
    if (gameState !== 'playing') return
    setIsSlicing(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setSliceTrail([{ x, y }])
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSlicing || gameState !== 'playing') return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setSliceTrail(prev => [...prev.slice(-10), { x, y }])
    
    // Check collision with fruits
    fruits.forEach(fruit => {
      const distance = Math.sqrt(Math.pow(fruit.x - x, 2) + Math.pow(fruit.y - y, 2))
      if (distance < fruit.size / 2) {
        sliceFruit(fruit.id, x, y)
      }
    })
  }

  const handlePointerUp = () => {
    setIsSlicing(false)
    setSliceTrail([])
  }

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const loop = () => {
      // Update fruits
      setFruits(prev => prev.map(fruit => ({
        ...fruit,
        x: fruit.x + fruit.vx,
        y: fruit.y + fruit.vy,
        vy: fruit.vy + 0.3, // Reduced gravity
        rotation: fruit.rotation + fruit.rotationSpeed
      })).filter(fruit => fruit.y < 110)) // Remove off-screen fruits
      
      // Update particles
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.3,
        life: p.life - 0.02
      })).filter(p => p.life > 0))
      
      gameLoopRef.current = requestAnimationFrame(loop)
    }
    
    gameLoopRef.current = requestAnimationFrame(loop)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameState])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [gameState])

  // Spawn fruits
  useEffect(() => {
    if (gameState !== 'playing') return
    
    spawnIntervalRef.current = setInterval(() => {
      spawnFruit()
    }, insaneMode ? 800 : 1200)
    
    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
    }
  }, [gameState, insaneMode])

  const endGame = () => {
    setGameState('ended')
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
  }

  const closeGame = () => {
    setIsActive(false)
    setGameState('idle')
    setInsaneMode(false)
  }

  // Activate game (can be triggered by button or key combo)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        closeGame()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isActive])

  if (!isActive) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-gradient-to-b from-orange-900 to-red-900"
    >
      <div
        ref={canvasRef as any}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-none overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Fruits */}
        {fruits.map(fruit => (
          <motion.div
            key={fruit.id}
            className="absolute rounded-full"
            style={{
              left: `${fruit.x}%`,
              top: `${fruit.y}%`,
              width: `${fruit.size}px`,
              height: `${fruit.size}px`,
              backgroundColor: fruitColors[fruit.type],
              transform: `translate(-50%, -50%) rotate(${fruit.rotation}deg)`,
              boxShadow: fruit.type === 'bomb' ? '0 0 20px rgba(255, 0, 0, 0.8)' : '0 4px 8px rgba(0,0,0,0.3)',
              border: fruit.type === 'bomb' ? '3px solid #ff0000' : 'none'
            }}
          />
        ))}
        
        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              opacity: particle.life,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
        
        {/* Slice Trail */}
        {sliceTrail.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: '100%', height: '100%' }}>
            <motion.path
              d={`M ${sliceTrail.map((p) => `${(p.x / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920)} ${(p.y / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1080)}`).join(' L ')}`}
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </svg>
        )}
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {gameState === 'idle' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          >
            <h1 className="text-7xl font-bold text-white mb-4" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
              FRUIT SLASHER
            </h1>
            <p className="text-2xl text-white/80 mb-8">Slice 10 fruits in 20 seconds!</p>
            {insaneMode && (
              <p className="text-xl text-yellow-400 mb-4 animate-pulse">⚡ INSANE MODE ACTIVATED ⚡</p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-12 py-4 bg-white text-orange-600 font-bold text-2xl rounded-full shadow-lg"
            >
              START SLICING
            </motion.button>
            <button
              onClick={closeGame}
              className="mt-8 text-white/60 hover:text-white transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <>
            <div className="absolute top-8 left-8 text-white">
              <div className="text-4xl font-bold">Score: {score}</div>
              <div className="text-2xl">Fruits: {fruitsSliced}/10</div>
              {combo > 1 && (
                <motion.div
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="text-3xl text-yellow-400 font-bold"
                >
                  COMBO x{combo}!
                </motion.div>
              )}
            </div>
            
            <div className="absolute top-8 right-8 text-white">
              <div className="text-5xl font-bold">{timeLeft}s</div>
            </div>
          </>
        )}

        {gameState === 'ended' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto bg-black/50"
          >
            <h2 className="text-6xl font-bold text-white mb-8">
              {fruitsSliced >= 10 ? '🎉 VICTORY! 🎉' : '💥 TIME UP! 💥'}
            </h2>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white">
              <div className="text-3xl mb-4">Final Score: <span className="text-yellow-400">{score}</span></div>
              <div className="text-2xl">Fruits Sliced: {fruitsSliced}/10</div>
            </div>
            <div className="flex gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg"
              >
                RETRY
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeGame}
                className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg"
              >
                EXIT
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
