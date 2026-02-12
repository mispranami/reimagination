'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

interface Target {
  id: number
  x: number
  y: number
  size: number
  speed: number
  direction: number
}

interface Projectile {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
}

export default function SkillShotArena() {
  const [isActive, setIsActive] = useState(false)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle')
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [accuracy, setAccuracy] = useState(100)
  const [shotsFired, setShotsFired] = useState(0)
  const [hits, setHits] = useState(0)
  const [cooldown, setCooldown] = useState(0)
  const [targets, setTargets] = useState<Target[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [rank, setRank] = useState('')
  const [targetsSpawned, setTargetsSpawned] = useState(0)
  
  const arenaRef = useRef<HTMLDivElement>(null)
  const keySequence = useRef<string[]>([])
  const lastKeyTime = useRef<number>(0)
  const gameLoopRef = useRef<number>()
  const projectileIdRef = useRef(0)
  const targetIdRef = useRef(0)

  // Secret activation: S D S
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const now = Date.now()
      
      // Reset if more than 2 seconds since last key
      if (now - lastKeyTime.current > 2000) {
        keySequence.current = []
      }
      
      lastKeyTime.current = now
      keySequence.current.push(key)
      
      // Keep only last 3 keys
      if (keySequence.current.length > 3) {
        keySequence.current.shift()
      }
      
      // Check for S D S sequence
      if (keySequence.current.join('') === 'sds') {
        activateArena()
        keySequence.current = []
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const activateArena = () => {
    // Glitch animation
    const body = document.body
    body.style.animation = 'glitch 0.3s ease-in-out'
    
    setTimeout(() => {
      body.style.animation = ''
      setIsActive(true)
    }, 300)
  }

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setCombo(0)
    setTimeLeft(15)
    setAccuracy(100)
    setShotsFired(0)
    setHits(0)
    setTargets([])
    setProjectiles([])
    setTargetsSpawned(0)
    
    // Spawn first target immediately
    spawnTarget()
  }

  const spawnTarget = () => {
    setTargetsSpawned(prev => {
      if (prev >= 10) return prev
      
      const newTarget: Target = {
        id: targetIdRef.current++,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        size: 40,
        speed: 0.8,
        direction: Math.random() * Math.PI * 2
      }
      setTargets(prevTargets => [...prevTargets, newTarget])
      
      return prev + 1
    })
  }

  const fireProjectile = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || cooldown > 0) return
    
    const rect = arenaRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const clickX = ((e.clientX - rect.left) / rect.width) * 100
    const clickY = ((e.clientY - rect.top) / rect.height) * 100
    
    const newProjectile: Projectile = {
      id: projectileIdRef.current++,
      x: 50,
      y: 95,
      targetX: clickX,
      targetY: clickY
    }
    
    setProjectiles(prev => [...prev, newProjectile])
    setShotsFired(prev => prev + 1)
    setCooldown(0.5)
    
    // Animate projectile
    setTimeout(() => {
      setProjectiles(prev => prev.filter(p => p.id !== newProjectile.id))
      checkCollision(clickX, clickY)
    }, 200)
  }

  const checkCollision = (x: number, y: number) => {
    let hit = false
    setTargets(prev => {
      const newTargets = prev.filter(target => {
        const distance = Math.sqrt(
          Math.pow(target.x - x, 2) + Math.pow(target.y - y, 2)
        )
        if (distance < target.size / 2) {
          hit = true
          return false
        }
        return true
      })
      
      if (hit) {
        setHits(h => h + 1)
        setCombo(c => c + 1)
        setScore(s => s + 10 * Math.max(1, Math.floor(combo / 3)))
        
        // Screen shake
        if (arenaRef.current) {
          gsap.to(arenaRef.current, {
            x: gsap.utils.random(-5, 5),
            y: gsap.utils.random(-5, 5),
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              gsap.set(arenaRef.current, { x: 0, y: 0 })
            }
          })
        }
      } else {
        setCombo(0)
      }
      
      return newTargets
    })
  }

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const loop = () => {
      // Update targets
      setTargets(prev => prev.map(target => {
        let newX = target.x + Math.cos(target.direction) * target.speed
        let newY = target.y + Math.sin(target.direction) * target.speed
        let newDirection = target.direction
        
        // Bounce off walls
        if (newX < 5 || newX > 95) {
          newDirection = Math.PI - newDirection
          newX = Math.max(5, Math.min(95, newX))
        }
        if (newY < 5 || newY > 95) {
          newDirection = -newDirection
          newY = Math.max(5, Math.min(95, newY))
        }
        
        return { ...target, x: newX, y: newY, direction: newDirection }
      }))
      
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

  // Cooldown
  useEffect(() => {
    if (cooldown <= 0) return
    
    const interval = setInterval(() => {
      setCooldown(prev => Math.max(0, prev - 0.05))
    }, 50)
    
    return () => clearInterval(interval)
  }, [cooldown])

  // Spawn targets periodically
  useEffect(() => {
    if (gameState !== 'playing' || targetsSpawned >= 10) return
    
    const interval = setInterval(() => {
      if (targetsSpawned < 10 && targets.length < 3) {
        spawnTarget()
      }
    }, 1500)
    
    return () => clearInterval(interval)
  }, [gameState, targets.length, targetsSpawned])

  const endGame = () => {
    setGameState('ended')
    const finalAccuracy = shotsFired > 0 ? Math.round((hits / shotsFired) * 100) : 0
    setAccuracy(finalAccuracy)
    
    // Calculate rank based on hits out of 10
    let finalRank = 'C'
    if (hits >= 9) finalRank = 'S+'
    else if (hits >= 7) finalRank = 'S'
    else if (hits >= 5) finalRank = 'A'
    else if (hits >= 3) finalRank = 'B'
    
    setRank(finalRank)
  }

  const closeArena = () => {
    setIsActive(false)
    setGameState('idle')
  }

  if (!isActive) return null

  return (
    <>
      <style jsx global>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
          25% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
          50% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
          75% { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
        }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm"
      >
        {/* Arena */}
        <div
          ref={arenaRef}
          onClick={fireProjectile}
          className="relative w-full h-full cursor-crosshair overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #0a0a1a 0%, #000000 100%)'
          }}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />

          {/* UI */}
          {gameState === 'idle' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.h1
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-6xl font-bold text-cyan-400 mb-4 tracking-wider"
                style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
              >
                TRAINING MODE UNLOCKED
              </motion.h1>
              <p className="text-xl text-gray-400 mb-8">COMBAT CALIBRATION SIMULATOR</p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-12 py-4 bg-red-600 text-white font-bold text-xl tracking-wider"
                style={{
                  clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                }}
              >
                BEGIN TRAINING
              </motion.button>
              <button
                onClick={closeArena}
                className="mt-8 text-gray-500 hover:text-white transition-colors"
              >
                ESC TO EXIT
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <>
              {/* Top HUD */}
              <div className="absolute top-8 left-0 right-0 flex justify-between px-12">
                <div className="text-white text-2xl font-bold">
                  SCORE: <span className="text-cyan-400">{score}</span>
                </div>
                <div className="text-white text-3xl font-bold">
                  {timeLeft}s
                </div>
                <div className="text-white text-2xl font-bold">
                  COMBO: <span className="text-yellow-400">x{combo}</span>
                </div>
              </div>

              {/* Targets */}
              {targets.map(target => (
                <motion.div
                  key={target.id}
                  className="absolute rounded-full border-4 border-red-500"
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    width: `${target.size}px`,
                    height: `${target.size}px`,
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3), transparent)',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)'
                  }}
                >
                  <div className="absolute inset-2 rounded-full border-2 border-red-400" />
                </motion.div>
              ))}

              {/* Projectiles */}
              {projectiles.map(proj => (
                <motion.div
                  key={proj.id}
                  initial={{ x: '50%', y: '95%' }}
                  animate={{ x: `${proj.targetX}%`, y: `${proj.targetY}%` }}
                  transition={{ duration: 0.2, ease: 'linear' }}
                  className="absolute w-3 h-3 rounded-full bg-cyan-400"
                  style={{
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}

              {/* Cooldown Bar */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-400"
                  style={{ width: `${(1 - cooldown / 0.5) * 100}%` }}
                />
              </div>
            </>
          )}

          {gameState === 'ended' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-8xl font-bold mb-8"
                style={{
                  color: rank === 'S+' ? '#ffd700' : rank === 'S' ? '#ff4655' : rank === 'A' ? '#00ffff' : '#888',
                  textShadow: '0 0 30px currentColor'
                }}
              >
                RANK {rank}
              </motion.div>
              
              <div className="bg-black/50 border border-cyan-400/30 rounded-xl p-8 backdrop-blur-md">
                <div className="grid grid-cols-2 gap-8 text-white text-xl">
                  <div>FINAL SCORE:</div>
                  <div className="text-cyan-400 font-bold">{score}</div>
                  <div>ACCURACY:</div>
                  <div className="text-cyan-400 font-bold">{accuracy}%</div>
                  <div>HITS:</div>
                  <div className="text-cyan-400 font-bold">{hits}/{shotsFired}</div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-3 bg-red-600 text-white font-bold"
                >
                  RETRY
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeArena}
                  className="px-8 py-3 bg-gray-700 text-white font-bold"
                >
                  EXIT
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  )
}
