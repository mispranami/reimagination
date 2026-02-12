'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface IntroSequenceProps {
  onComplete: () => void
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const logoRef = useRef<HTMLDivElement>(null)
  const topHalfRef = useRef<HTMLDivElement>(null)
  const bottomHalfRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 300)
      }
    })

    // Logo scale up with power4.out ease
    tl.fromTo(
      logoRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power4.out' }
    )

    // Glitch/flicker effect
    tl.to(logoRef.current, {
      opacity: 0.3,
      duration: 0.05,
      repeat: 3,
      yoyo: true,
      ease: 'none'
    }, '+=0.3')

    // Hold for a moment
    tl.to(logoRef.current, { duration: 0.2 })

    // Split overlay - top and bottom slide away
    tl.to(topHalfRef.current, {
      y: '-100%',
      duration: 0.8,
      ease: 'power4.inOut'
    }, '-=0.2')
    
    tl.to(bottomHalfRef.current, {
      y: '100%',
      duration: 0.8,
      ease: 'power4.inOut'
    }, '<')

    tl.to(logoRef.current, {
      opacity: 0,
      scale: 1.5,
      duration: 0.6,
      ease: 'power2.in'
    }, '<')

  }, [onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Top Half */}
      <div
        ref={topHalfRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-black flex items-end justify-center"
      >
        <div ref={logoRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="text-white text-8xl font-bold tracking-wider">
            RIOT
          </div>
        </div>
      </div>

      {/* Bottom Half */}
      <div
        ref={bottomHalfRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-black"
      />
    </div>
  )
}
