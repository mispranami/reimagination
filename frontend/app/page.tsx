'use client'

import { useState, useEffect } from 'react'
import NexusTunnel from '@/components/NexusTunnel'
import DashboardHUD from '@/components/DashboardHUD'
import BackgroundVideo from '@/components/BackgroundVideo'
import IntroSequence from '@/components/IntroSequence'
import ExploreButton from '@/components/ExploreButton'
import EsportsHub from '@/components/EsportsHub'
import AboutSection from '@/components/AboutSection'
import Footer from '@/components/Footer'
import SkillShotArena from '@/components/SkillShotArena'
import FruitSlasher from '@/components/FruitSlasher'

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

export default function Home() {
  const [activeGame, setActiveGame] = useState<Game | null>(null)
  const [showIntro, setShowIntro] = useState(true)

  return (
    <>
      {showIntro && <IntroSequence onComplete={() => setShowIntro(false)} />}
      <SkillShotArena />
      <FruitSlasher />
      <BackgroundVideo />
      <div className="noise-overlay" />
      <main className="relative min-h-screen bg-transparent" style={{ zIndex: 2 }}>
        <DashboardHUD currentGame={activeGame} />
        <div className="relative">
          <NexusTunnel setActiveGame={setActiveGame} />
          <ExploreButton />
        </div>
        <EsportsHub />
        <AboutSection />
        <Footer />
      </main>
    </>
  )
}
