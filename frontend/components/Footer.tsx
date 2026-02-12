'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Social Icons */}
          <div className="flex gap-6">
            {['Twitter', 'YouTube', 'Instagram', 'Discord'].map((social) => (
              <motion.a
                key={social}
                href="#"
                whileHover={{ scale: 1.1, color: '#ef4444' }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                  {social[0]}
                </div>
              </motion.a>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>

          {/* Credit */}
          <div className="text-gray-500 text-sm">
            Solo Hackathon Project © 2026
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
          Riot Nexus - An immersive 3D experience reimagining game discovery
        </div>
      </div>
    </footer>
  )
}
