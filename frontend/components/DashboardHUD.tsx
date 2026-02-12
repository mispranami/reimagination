'use client'

import { motion, AnimatePresence } from 'framer-motion'

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

interface DashboardHUDProps {
  currentGame: Game | null
}

export default function DashboardHUD({ currentGame }: DashboardHUDProps) {
  if (!currentGame) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-8 right-8 z-50 p-6 rounded-2xl border border-white/10 backdrop-blur-md"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="flex flex-col gap-4 min-w-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGame.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">{currentGame.name}</h3>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.span 
                  className="text-red-500 text-xs font-medium"
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  LIVE
                </motion.span>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex flex-col gap-3">
              <motion.div
                key={`players-${currentGame.stats.active_players}`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center justify-between"
              >
                <span className="text-white/60 text-sm">Active Players</span>
                <motion.span 
                  className="text-white font-bold text-xl"
                  initial={{ scale: 1.2, color: '#60a5fa' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.5 }}
                >
                  {currentGame.stats.active_players}
                </motion.span>
              </motion.div>

              <motion.div
                key={`winrate-${currentGame.stats.win_rate}`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
                className="flex items-center justify-between"
              >
                <span className="text-white/60 text-sm">Win Rate</span>
                <motion.span 
                  className="text-white font-bold text-xl"
                  initial={{ scale: 1.2, color: '#60a5fa' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.5 }}
                >
                  {currentGame.stats.win_rate}
                </motion.span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between"
              >
                <span className="text-white/60 text-sm">Current Patch</span>
                <span className="text-white font-bold">{currentGame.stats.current_patch}</span>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
