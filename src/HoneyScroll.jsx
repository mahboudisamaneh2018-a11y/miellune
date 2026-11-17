import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Steam from './Steam.jsx'

const FRAME_COUNT = 120
// Centre et largeur de la mousse dans l'image (en % de l'image)
const CUP = { x: 0.61, y: 0.37, w: 0.42 }
const src = (i) => `/frames/frame_${String(i + 1).padStart(3, '0')}.webp`

// Fond fixe : la tasse reste derrière toute la page.
// Le miel avance avec le scroll de TOUTE la page : en bas, la lune est formée.
export default function HoneyScroll() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const images = []
    const state = { frame: 0 }

    const render = () => {
      const img = images[state.frame]
      if (!img || !img.complete || !img.naturalWidth) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      const W = canvas.width
      const H = canvas.height
      const portrait = W / H < 1
      let scale, ox, oy
      if (!portrait) {
        // Desktop / tablette paysage : plein écran (cover), tasse centrée sur son point focal
        scale = Math.max(W / img.width, H / img.height)
        ox = Math.min(0, Math.max(W - img.width * scale, W * 0.62 - img.width * scale * CUP.x))
        oy = (H - img.height * scale) / 2
      } else {
        // Mobile / portrait : on dézoome pour garder toute la tasse et la lune visibles
        scale = (W * 1.7) / img.width
        ox = W / 2 - img.width * scale * CUP.x
        oy = H * 0.6 - img.height * scale * CUP.y
      }
      const dw = img.width * scale
      const dh = img.height * scale
      ctx.fillStyle = '#1b120c'
      ctx.fillRect(0, 0, W, H)
      ctx.drawImage(img, ox, oy, dw, dh)
      if (portrait) {
        // Fondus haut / bas pour fondre l'image dans le fond sombre
        const fade = dh * 0.18
        let gr = ctx.createLinearGradient(0, oy, 0, oy + fade)
        gr.addColorStop(0, '#1b120c'); gr.addColorStop(1, 'rgba(27,18,12,0)')
        ctx.fillStyle = gr; ctx.fillRect(0, oy, W, fade)
        gr = ctx.createLinearGradient(0, oy + dh - fade, 0, oy + dh)
        gr.addColorStop(0, 'rgba(27,18,12,0)'); gr.addColorStop(1, '#1b120c')
        ctx.fillStyle = gr; ctx.fillRect(0, oy + dh - fade, W, fade)
      }

      // Position du bord de la tasse à l'écran → pour placer la vapeur
      const bg = canvas.parentElement
      bg.style.setProperty('--cup-x', `${(ox + dw * CUP.x) / dpr}px`)
      bg.style.setProperty('--cup-y', `${(oy + dh * CUP.y) / dpr}px`)
      bg.style.setProperty('--cup-w', `${(dw * CUP.w) / dpr}px`)
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = src(i)
      img.onload = () => { if (i === state.frame) render() }
      images.push(img)
    }

    const tween = gsap.to(state, {
      frame: FRAME_COUNT - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: render,
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
      },
    })

    window.addEventListener('resize', render)
    return () => {
      window.removeEventListener('resize', render)
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div className="bg" aria-hidden="true">
      <canvas ref={canvasRef} className="bg__canvas" />
      <div className="bg__shade" />
      <Steam />
    </div>
  )
}

