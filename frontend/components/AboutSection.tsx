'use client'

import { motion } from 'framer-motion'

export default function AboutSection() {
  const cards = [
    {
      title: 'Our Games',
      description: 'Creating genre-defining experiences that bring players together across the globe.',
      icon: '🎮'
    },
    {
      title: 'Our Players',
      description: 'Building communities where every player matters and every voice is heard.',
      icon: '👥'
    },
    {
      title: 'Our Mission',
      description: 'To be the most player-focused game company in the world.',
      icon: '🎯'
    }
  ]

  return (
    <section className="relative min-h-screen bg-black py-20 px-8 overflow-hidden">
      {/* Large Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-bold text-white/5 whitespace-nowrap pointer-events-none">
        WE ARE RIOT
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-7xl font-bold text-white mb-4"
        >
          WE ARE RIOT
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl text-gray-400 mb-16 max-w-2xl"
        >
          We're a game company that values players above all else. We build games, we support communities, and we champion competition.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-8 group cursor-pointer"
            >
              <div className="text-6xl mb-6">{card.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
