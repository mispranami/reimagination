'use client'

import { motion } from 'framer-motion'

export default function ExploreButton() {
  const handleClick = () => {
    window.scrollTo({ 
      top: window.innerHeight * 4.2, 
      behavior: 'smooth' 
    })
  }

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
      <motion.button
        onClick={handleClick}
        className="px-12 py-4 bg-blue-600 text-white font-bold text-lg tracking-wider relative overflow-hidden group"
        style={{
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
          style={{ opacity: 0.2 }}
        />
        <span className="relative z-10">EXPLORE THE UNIVERSE</span>
      </motion.button>
      
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </div>
  )
}
