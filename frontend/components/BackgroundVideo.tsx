'use client'

export default function BackgroundVideo() {
  return (
    <>
      <video
        className="fixed inset-0 w-full h-full object-cover z-[-1] pointer-events-none"
        src="/bg-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlayThrough={(e) => e.currentTarget.play()}
      />
      <div 
        className="fixed inset-0 bg-black/60 pointer-events-none"
        style={{ zIndex: 0 }}
      />
    </>
  )
}
