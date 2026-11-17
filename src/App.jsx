import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HoneyScroll from './HoneyScroll.jsx'

gsap.registerPlugin(ScrollTrigger)

// Menu fictif (projet concept)
const MENU = [
  { name: 'Latte Miellune', desc: 'Espresso, lait velouté, filet de miel', price: '5,75 $' },
  { name: 'Espresso doré', desc: 'Torréfaction maison, notes de caramel', price: '3,50 $' },
  { name: 'Chaï au miel', desc: 'Thé noir, épices douces, miel de fleurs', price: '5,25 $' },
  { name: 'Lune glacée', desc: 'Cold brew, crème légère, miel', price: '6,00 $' },
  { name: 'Croissant lune', desc: 'Pur beurre, glaçage au miel', price: '4,25 $' },
]

export default function App() {
  useEffect(() => {
    // Scroll doux synchronisé avec GSAP
    const lenis = new Lenis({ lerp: 0.09 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Apparition douce des blocs de texte
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 50,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        })
      })
    })

    return () => {
      ctx.revert()
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <HoneyScroll />

      <header className="header">
        <span className="logo">Miellune</span>
        <nav>
          <a href="#histoire">Histoire</a>
          <a href="#menu">Menu</a>
          <a href="#visite">Visite</a>
        </nav>
      </header>

      <main className="content">
        <section className="panel panel--hero">
          <p className="eyebrow reveal">Café · Miel · Lune</p>
          <h1 className="title reveal">Un café <em>doré</em><br />comme le miel.</h1>
          <span className="hint">Défilez</span>
        </section>

        <section className="panel" id="histoire">
          <p className="eyebrow reveal">Notre histoire</p>
          <h2 className="title reveal">Lentement,<br />le miel coule…</h2>
          <p className="lead reveal">
            Chaque tasse commence par un geste simple : un filet de miel doré versé sur un lait velouté.
            Rien ne presse ici.
          </p>
        </section>

        <section className="panel panel--right" id="menu">
          <p className="eyebrow reveal">Le menu</p>
          <h2 className="title reveal">Douceurs<br />du matin.</h2>
          <ul className="menu">
            {MENU.map((item) => (
              <li className="reveal" key={item.name}>
                <div>
                  <span className="menu__name">{item.name}</span>
                  <span className="menu__desc">{item.desc}</span>
                </div>
                <span className="menu__price">{item.price}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel" id="visite">
          <p className="eyebrow reveal">Nous visiter</p>
          <h2 className="title reveal">Une pause<br />dorée.</h2>
          <div className="info">
            <div className="info__block reveal">
              <h3>Heures</h3>
              <p>Lun – Ven · 7 h – 18 h</p>
              <p>Sam – Dim · 8 h – 17 h</p>
            </div>
            <div className="info__block reveal">
              <h3>Adresse</h3>
              <p>12, rue de la Lune</p>
              <p>Ville imaginaire, QC</p>
            </div>
            <div className="info__block reveal">
              <h3>Contact</h3>
              <p>bonjour@miellune.exemple</p>
              <p>À emporter ou sur place</p>
            </div>
          </div>
        </section>

        <section className="panel panel--final">
          <h2 className="title reveal">…et la <em>lune</em> se lève<br />dans votre tasse.</h2>
          <a className="cta reveal" href="#menu">Découvrir le menu</a>
        </section>
      </main>

      <footer className="footer">
        <p>Projet concept réalisé par Vysara — entreprise fictive.</p>
      </footer>
    </>
  )
}

