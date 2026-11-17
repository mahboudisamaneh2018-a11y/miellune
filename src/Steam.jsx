import { useEffect, useRef } from 'react'

// Vapeur réaliste : petites bouffées douces qui montent, grossissent et s'effacent.
// La position suit la tasse (variables --cup-x / --cup-y / --cup-w posées par HoneyScroll).
export default function Steam() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const bg = canvas.parentElement
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf
    const POOL = 60
    const PERIOD = 6 // secondes pour monter et disparaître
    const pool = Array.from({ length: POOL }, () => ({ x0: (Math.random() - 0.5) * 0.6, seed: Math.random() * 100, size: 0.07 + Math.random() * 0.05, lastK: 0 }))

    // Sprite : un nuage rond très doux
    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = 128
    const s = sprite.getContext('2d')
    const g = s.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, 'rgba(255, 244, 230, 0.5)')
    g.addColorStop(0.5, 'rgba(255, 244, 230, 0.2)')
    g.addColorStop(1, 'rgba(255, 244, 230, 0)')
    s.fillStyle = g
    s.fillRect(0, 0, 128, 128)

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    const cup = () => {
      const cs = getComputedStyle(bg)
      return {
        x: parseFloat(cs.getPropertyValue('--cup-x')) || canvas.clientWidth * 0.6,
        y: parseFloat(cs.getPropertyValue('--cup-y')) || canvas.clientHeight * 0.4,
        w: parseFloat(cs.getPropertyValue('--cup-w')) || canvas.clientWidth * 0.3,
      }
    }

    let last = performance.now()
    let t = 0
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      t += dt
      const c = cup()

      // Pool fixe de bouffées, réparties régulièrement dans le temps :
      // la densité reste constante → aucun "flash" ni pulsation.
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < POOL; i++) {
        const p = pool[i]
        const k = ((t / PERIOD) + i / POOL) % 1
        if (k < p.lastK) {
          // la bouffée renaît : nouvelle position de départ
          p.x0 = (Math.random() - 0.5) * 0.6
          p.seed = Math.random() * 100
          p.size = 0.07 + Math.random() * 0.05
        }
        p.lastK = k
        const x = c.x + p.x0 * c.w + Math.sin(t * 0.8 + p.seed) * c.w * 0.04 * k
        const y = c.y + c.w * 0.04 - k * c.w * 0.75
        const r = c.w * p.size * (1 + k * 2.2)
        // courbe douce : monte lentement, s'efface lentement
        const alpha = Math.sin(Math.PI * k) ** 2 * 0.03
        ctx.globalAlpha = alpha
        ctx.drawImage(sprite, (x - r) * dpr, (y - r) * dpr, r * 2 * dpr, r * 2 * dpr)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="steam-canvas" />
}

