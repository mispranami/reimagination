'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export default function AboutSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const cards = [
    {
      title: 'Our Games',
      description: 'Creating genre-defining experiences that bring players together across the globe.',
      icon: '🎮',
      gradient: 'from-blue-600/20 to-cyan-600/20'
    },
    {
      title: 'Our Players',
      description: 'Building communities where every player matters and every voice is heard.',
      icon: '👥',
      gradient: 'from-purple-600/20 to-pink-600/20'
    },
    {
      title: 'Our Mission',
      description: 'To be the most player-focused game company in the world.',
      icon: '🎯',
      gradient: 'from-red-600/20 to-orange-600/20'
    }
  ]

  return (
    <section className="relative min-h-screen bg-black py-20 px-8 overflow-hidden">
      {/* Animated Background Video */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920&h=1080&fit=crop)',
            filter: 'blur(8px) brightness(0.4)'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Large Background Text with Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-bold text-white/5 whitespace-nowrap pointer-events-none">
        <motion.div
          animate={{
            textShadow: [
              '0 0 20px rgba(239, 68, 68, 0.3)',
              '0 0 40px rgba(239, 68, 68, 0.5)',
              '0 0 20px rgba(239, 68, 68, 0.3)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          WE ARE RIOT
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-7xl font-bold text-white mb-4 relative inline-block">
            WE ARE RIOT
            <motion.div
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-500 to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mt-6"
          >
            We're a game company that values players above all else. We build games, we support communities, and we champion competition.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ 
                y: -15,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className={`relative bg-gradient-to-br ${card.gradient} backdrop-blur-sm border border-white/10 rounded-2xl p-8 group cursor-pointer overflow-hidden`}
            >
              {/* Animated Border Glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(45deg, transparent, rgba(239, 68, 68, 0.3), transparent)',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
              
              <motion.div 
                className="text-7xl mb-6 relative z-10"
                whileHover={{ 
                  scale: 1.2,
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
              >
                {card.icon}
              </motion.div>
              
              <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors relative z-10">
                {card.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed relative z-10">
                {card.description}
              </p>

              {/* Shine Effect on Hover */}
              <motion.div
                className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                initial={{ left: '-100%' }}
                whileHover={{ left: '200%' }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-8 mt-16"
        >
          {[
            { label: 'Active Players', value: '250M+' },
            { label: 'Games Worldwide', value: '4' },
            { label: 'Esports Events', value: '1000+' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
            >
              <motion.div 
                className="text-5xl font-bold text-red-500 mb-2"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
