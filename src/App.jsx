import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, Lightformer } from '@react-three/drei'
import {
  motion, useScroll, useTransform, useSpring, useMotionValueEvent, useInView, animate,
} from 'framer-motion'
import Lenis from 'lenis'
import CameraModel from './CameraModel.jsx'

const PHONES = ['8755979575', '7579911166']

const packages = [
  { name: 'HD Camera Package', price: 15999, tech: 'HD DVR', items: ['4 HD Camera (2MP)', '4 Channel DVR', '500GB Hard Disk', 'All Accessories', 'Installation'] },
  { name: 'IP Camera Package', price: 24999, tech: 'NVR', items: ['4 IP Camera (4MP)', '4 Channel NVR', '500GB Hard Disk', 'All Accessories', 'Installation'], hot: true },
]
const features = [
  ['HD', 'High Definition', 'Clear video quality'],
  ['☾', 'Night Vision', 'Up to 30 meter'],
  ['⚡', 'Motion Detection', 'Smart alerts'],
  ['☂', 'Weatherproof', 'IP66 rated'],
  ['★', 'Premium Quality', 'Accessories'],
]
const included = ['4 Camera', 'DVR / NVR', '500GB Hard Disk', 'Power Supply', 'BNC Connectors & Cable', 'Installation', 'FREE Mobile App Setup']
const perfect = ['Home', 'Office', 'Society', 'Shop', 'Factory', 'Warehouse'].map((n) => [n, `img/${n.toLowerCase()}.jpg`])
const buildSteps = [
  ['01', 'Mount', 'Rigid wall bracket rated for outdoor use.'],
  ['02', 'Housing', 'Weatherproof IP66 shell with sun hood.'],
  ['03', 'Night Vision', 'IR LED array — sees up to 30 m in darkness.'],
  ['04', 'Optics', '2MP HD / 4MP IP lens, crisp day and night.'],
  ['05', 'Connected', 'Live on your phone via P2P cloud.'],
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
}

function Counter({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{prefix}{v.toLocaleString('en-IN')}{suffix}</span>
}

function TiltCard({ children, className }) {
  const ref = useRef(null)
  const [t, setT] = useState({ x: 0, y: 0 })
  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect()
        setT({ x: ((e.clientY - r.top) / r.height - 0.5) * -10, y: ((e.clientX - r.left) / r.width - 0.5) * 10 })
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      animate={{ rotateX: t.x, rotateY: t.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      style={{ transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  )
}

function Nav() {
  const { scrollYProgress } = useScroll()
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <header className="nav">
      <motion.div className="progress" style={{ scaleX: w }} />
      <a href="#top" className="logo"><img src="logo.png" alt="India Mate CCTV & Security Services" /></a>
      <nav>
        <a href="#build">Product</a><a href="#packages">Packages</a><a href="#included">Included</a>
        <a className="btn btn-sm" href={`tel:${PHONES[0]}`}>Call Now</a>
      </nav>
    </header>
  )
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 250])
  const o = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const s = useTransform(scrollYProgress, [0, 1], [1, 0.85])
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const bgS = useTransform(scrollYProgress, [0, 1], [1.05, 1.25])
  const words = 'HD & IP CAMERA'.split(' ')
  return (
    <section id="top" ref={ref} className="hero">
      <motion.div className="hero-photo" style={{ y: bgY, scale: bgS, backgroundImage: 'url(img/hero.jpg)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }} />
      <div className="hero-shade" />
      <div className="grid-bg" />
      <motion.div className="hero-inner" style={{ y, opacity: o, scale: s }}>
        <motion.img src="logo.png" alt="India Mate CCTV & Security Services" className="hero-logo"
          initial={{ opacity: 0, scale: 0.7, rotateX: -40 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
        <motion.div className="pill" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          📍 Delhi · Noida · Greater Noida
        </motion.div>
        <h1>
          {words.map((w, i) => (
            <motion.span key={i} className="word" initial={{ y: '110%', rotateX: -80 }} animate={{ y: 0, rotateX: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>{w}&nbsp;</motion.span>
          ))}
        </h1>
        <motion.p className="tag" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: 'spring' }}>
          Complete Security Solution
        </motion.p>
        <motion.p className="lead" variants={fadeUp} initial="hidden" animate="show" custom={10}>
          Secure today, protected tomorrow. All-inclusive CCTV setups starting at <b>₹15,999</b> — installed by experts, live on your phone.
        </motion.p>
        <motion.div className="cta-row" variants={fadeUp} initial="hidden" animate="show" custom={12}>
          <a href="#packages" className="btn">View Packages</a>
          <a href={`tel:${PHONES[0]}`} className="btn btn-ghost">📞 {PHONES[0]}</a>
        </motion.div>
      </motion.div>
      <motion.div className="scroll-hint" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
        Scroll to build ↓
      </motion.div>
    </section>
  )
}

function BuildSection() {
  const ref = useRef(null)
  const progress = useRef(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22 })
  const [step, setStep] = useState(0)
  useMotionValueEvent(smooth, 'change', (v) => {
    progress.current = v
    setStep(Math.min(buildSteps.length - 1, Math.floor(v * buildSteps.length)))
  })
  const bar = useTransform(smooth, [0, 1], ['0%', '100%'])
  return (
    <section id="build" ref={ref} className="build">
      <div className="sticky">
        <div className="canvas-wrap">
          <Canvas camera={{ position: [0, 0.8, 6], fov: 40 }} dpr={[1, 2]}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[4, 6, 5]} intensity={2} />
            <pointLight position={[-4, -2, 3]} color="#2f6bff" intensity={30} />
            <CameraModel progress={progress} />
            <ContactShadows position={[0, -1.4, 0]} opacity={0.5} blur={2.5} scale={8} />
            <Environment resolution={256}><Lightformer intensity={3} position={[0, 4, 4]} scale={[8, 2, 1]} /><Lightformer intensity={2} color="#4a7bff" position={[-5, 0, 2]} scale={[2, 6, 1]} /><Lightformer intensity={2} position={[5, 1, -2]} scale={[2, 6, 1]} /></Environment>
          </Canvas>
        </div>
        <div className="build-copy">
          <span className="eyebrow">Product build</span>
          <h2>Engineered piece by piece</h2>
          <div className="steps">
            {buildSteps.map(([n, t, d], i) => (
              <motion.div key={n} className={`step ${i === step ? 'on' : ''}`}
                animate={{ opacity: i === step ? 1 : 0.35, x: i === step ? 0 : -10 }}>
                <span className="n">{n}</span>
                <div><h4>{t}</h4>{i === step && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>{d}</motion.p>}</div>
              </motion.div>
            ))}
          </div>
          <div className="bar"><motion.div style={{ width: bar }} /></div>
        </div>
      </div>
    </section>
  )
}

function Installation() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const clip = useTransform(scrollYProgress, [0, 1], ['inset(20% 30% 20% 0% round 28px)', 'inset(0% 0% 0% 0% round 28px)'])
  const imgS = useTransform(scrollYProgress, [0, 1], [1.3, 1])
  const points = ['Trained, uniformed technicians', 'Neat concealed cabling', 'Mobile app set up on the spot', '1 year warranty + after-sales support']
  return (
    <section ref={ref} className="section install">
      <motion.div className="install-img" style={{ clipPath: clip }}>
        <motion.img src="img/installer.jpg" alt="India Mate technician installing a CCTV camera" style={{ scale: imgS }} />
      </motion.div>
      <div className="install-copy">
        <motion.span className="eyebrow" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>Expert installation team</motion.span>
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}>Installed right,<br />the first time</motion.h2>
        <ul>{points.map((t, i) => (
          <motion.li key={t} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i + 2}><i>✓</i>{t}</motion.li>
        ))}</ul>
      </div>
    </section>
  )
}

function Packages() {
  return (
    <section id="packages" className="section">
      <motion.div className="head" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
        <span className="eyebrow">Best Combo Offer</span>
        <h2>Choose your package</h2>
      </motion.div>
      <div className="pkgs">
        {packages.map((p, i) => (
          <motion.div key={p.name} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} custom={i * 2}>
            <TiltCard className={`pkg ${p.hot ? 'hot' : ''}`}>
              {p.hot && <span className="ribbon">Most Popular</span>}
              <h3>{p.name}</h3>
              <div className="price"><Counter to={p.price} prefix="₹" suffix="/-" /></div>
              <span className="chip">All inclusive setup</span>
              <ul>{p.items.map((it, k) => (
                <motion.li key={it} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + k * 0.08 }}>
                  <i>✓</i>{it.startsWith('500GB') ? <><b className="red">500GB</b>&nbsp;Hard Disk</> : it}
                </motion.li>
              ))}</ul>
              <a className="btn full" href={`tel:${PHONES[0]}`}>Book Installation</a>
            </TiltCard>
          </motion.div>
        ))}
        <motion.div className="mix" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={4}>
          <span className="eyebrow">Mix technology</span>
          <h3>HD + IP<br />Support</h3>
          <p>📱 Mobile Viewing</p><p>🌐 Remote Access</p><p>☁️ P2P Cloud Support</p>
        </motion.div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="section features">
      {features.map(([ic, t, d], i) => (
        <motion.div key={t} className="feat" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
          whileHover={{ y: -8, rotateY: 8 }}>
          <span className="ic">{ic}</span><h4>{t}</h4><p>{d}</p>
        </motion.div>
      ))}
    </section>
  )
}

function Included() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-45%'])
  return (
    <section id="included" ref={ref} className="included">
      <div className="head"><span className="eyebrow">What's included</span><h2>Everything in the box</h2></div>
      <motion.div className="marquee" style={{ x }}>
        {included.map((t, i) => (
          <div key={t} className={`inc ${t.startsWith('FREE') ? 'free' : ''}`}><span>{String(i + 1).padStart(2, '0')}</span>{t}</div>
        ))}
      </motion.div>
    </section>
  )
}

function Trust() {
  const items = [
    [<Counter key="a" to={1000} suffix="+" />, 'Happy customers'],
    ['1 Year', 'Warranty'],
    ['24×7', 'After sales support'],
    ['100%', 'Customer satisfaction'],
  ]
  return (
    <section className="section trust">
      {items.map(([v, l], i) => (
        <motion.div key={l} className="stat" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
          <strong>{v}</strong><span>{l}</span>
        </motion.div>
      ))}
      <motion.div className="airtel" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
        <b>FREE</b> Airtel WiFi setup with every installation
      </motion.div>
    </section>
  )
}

function Perfect() {
  return (
    <section className="section">
      <div className="head"><span className="eyebrow">Perfect for</span><h2>Every space you care about</h2></div>
      <div className="perfect">
        {perfect.map(([p, img], i) => (
          <motion.div key={p} className={`pf ${img ? 'has-img' : ''}`} style={img ? { backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(4,15,46,.9)), url(${img})` } : undefined} initial={{ opacity: 0, rotateX: 60, y: 40 }} whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6 }} whileHover={{ scale: 1.06 }}>{p}</motion.div>
        ))}
      </div>
    </section>
  )
}

function Final() {
  return (
    <section className="final">
      <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <span className="eyebrow">Offer valid till 30 June 2025 — Hurry up!</span>
        <h2>Secure today.<br /><em>Protected tomorrow.</em></h2>
        <div className="phones">
          {PHONES.map((p) => (
            <motion.a key={p} href={`tel:${p}`} className="btn big" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>📞 {p}</motion.a>
          ))}
        </div>
      </motion.div>
      <footer><img src="logo.png" alt="India Mate" className="foot-logo" />© India Mate CCTV & Security Services — Your trusted security partner</footer>
    </section>
  )
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
    let id
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (a) { e.preventDefault(); lenis.scrollTo(a.getAttribute('href'), { offset: -60 }) }
    }
    document.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(id); lenis.destroy(); document.removeEventListener('click', onClick) }
  }, [])
  return (
    <>
      <Nav />
      <Hero />
      <BuildSection />
      <Features />
      <Installation />
      <Packages />
      <Included />
      <Trust />
      <Perfect />
      <Final />
    </>
  )
}
