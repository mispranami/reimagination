'use client'

import { motion } from 'framer-motion'

export default function NexusTunnel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="nexus-tunnel"
    >
      <p>NexusTunnel Component - Coming Soon</p>
    </motion.div>
  )
}
