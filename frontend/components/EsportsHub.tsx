'use client'

import { motion } from 'framer-motion'

export default function EsportsHub() {
  const matches = [
    { team1: 'T1', team2: 'GEN.G', score: '2-1', game: 'League of Legends' },
    { team1: 'LOUD', team2: 'FNATIC', score: '13-11', game: 'Valorant' },
    { team1: 'TSM', team2: 'C9', score: '3-2', game: 'TFT' },
    { team1: 'DRX', team2: 'EDG', score: '1-0', game: 'League of Legends' },
  ]

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-7xl font-bold text-white mb-4"
        >
          ESPORTS HUB
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl text-gray-400 mb-12"
        >
          Live matches and tournament highlights
        </motion.p>

        {/* Scrolling Marquee */}
        <div className="overflow-hidden bg-red-600/10 border border-red-600/30 rounded-lg mb-12">
          <motion.div
            className="flex gap-8 py-6"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {[...matches, ...matches, ...matches].map((match, index) => (
              <div key={index} className="flex items-center gap-4 min-w-[300px] px-6">
                <span className="text-white font-bold">{match.team1}</span>
                <span className="text-red-500 font-bold text-xl">{match.score}</span>
                <span className="text-white font-bold">{match.team2}</span>
                <span className="text-gray-500 text-sm">• {match.game}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Featured Tournament */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex flex-col justify-end p-12">
            <span className="text-red-500 font-bold mb-2">LIVE NOW</span>
            <h3 className="text-5xl font-bold text-white mb-4">VCT Masters 2026</h3>
            <p className="text-gray-300 text-lg">Watch the world's best Valorant teams compete for glory</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
