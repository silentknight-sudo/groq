import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Float } from '@react-three/drei'
import * as THREE from 'three'

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const ease = (t) => 1 - Math.pow(1 - t, 3)
// progress of a part within its window [a, b] of overall scroll progress
const seg = (p, a, b) => ease(clamp01((p - a) / (b - a)))

/**
 * A bullet CCTV camera built from primitives. Each part flies in from an
 * "exploded" offset and snaps into place as `progress.current` goes 0 → 1.
 */
export default function CameraModel({ progress }) {
  const root = useRef()
  const parts = {
    mount: useRef(), arm: useRef(), body: useRef(), hood: useRef(),
    lensRing: useRef(), lens: useRef(), irRing: useRef(), cable: useRef(),
  }
  const ledMat = useRef()

  const plan = [
    ['mount', [0, 0, -3.5], [0.2, 0.25]],
    ['arm', [0, 3, -2], [0.25, 0.35]],
    ['body', [-4, 0, 0], [0.3, 0.45]],
    ['hood', [0, 3.5, 0], [0.4, 0.55]],
    ['irRing', [5, 1, 0], [0.5, 0.62]],
    ['lensRing', [5, -1, 0], [0.55, 0.68]],
    ['lens', [6, 0, 0], [0.6, 0.72]],
    ['cable', [0, -3, -2], [0.65, 0.78]],
  ]

  useFrame((state, dt) => {
    const p = progress.current
    plan.forEach(([k, off, [a, b]]) => {
      const t = seg(p, a, b)
      const o = parts[k].current
      if (!o) return
      o.position.set(off[0] * (1 - t), off[1] * (1 - t), off[2] * (1 - t))
      o.rotation.z = (1 - t) * 1.6
      o.scale.setScalar(0.4 + 0.6 * t)
      o.visible = p > a - 0.05 || p < 0.02
    })
    // overall turntable
    const spin = THREE.MathUtils.lerp(1.2, -0.75, ease(clamp01(p)))
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, spin + state.pointer.x * 0.25, 4, dt)
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, 0.15 - state.pointer.y * 0.15, 4, dt)
    if (ledMat.current) ledMat.current.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 4) * 1.2 * seg(p, 0.8, 0.95)
  })

  const white = <meshPhysicalMaterial color="#f4f6fa" roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} />
  const dark = <meshStandardMaterial color="#14171f" roughness={0.35} metalness={0.6} />

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={root} scale={0.9}>
        {/* wall mount */}
        <group ref={parts.mount}>
          <mesh position={[-0.2, 0.9, -1.7]}>
            <cylinderGeometry args={[0.55, 0.55, 0.18, 48]} />{white}
          </mesh>
        </group>
        <group ref={parts.arm}>
          <mesh position={[-0.2, 0.75, -1.2]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.16, 1.0, 24]} />{white}
          </mesh>
          <mesh position={[-0.2, 0.55, -0.75]}>
            <sphereGeometry args={[0.2, 32, 32]} />{dark}
          </mesh>
        </group>
        {/* body */}
        <group ref={parts.body}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.1, 0.2, 0]}>
            <capsuleGeometry args={[0.55, 1.8, 16, 48]} />{white}
          </mesh>
          <mesh position={[0.1, 0.2, 0.56]}>
            <boxGeometry args={[1.2, 0.08, 0.02]} />
            <meshStandardMaterial color="#123a8f" />
          </mesh>
        </group>
        {/* sun hood */}
        <group ref={parts.hood}>
          <RoundedBox args={[2.6, 0.12, 1.35]} radius={0.05} position={[0.4, 0.82, 0]}>
            {white}
          </RoundedBox>
        </group>
        {/* front face + IR ring */}
        <group ref={parts.irRing}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[1.5, 0.2, 0]}>
            <cylinderGeometry args={[0.52, 0.52, 0.1, 48]} />{dark}
          </mesh>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2
            return (
              <mesh key={i} position={[1.56, 0.2 + Math.sin(a) * 0.4, Math.cos(a) * 0.4]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
                <meshStandardMaterial ref={i === 0 ? ledMat : undefined} color="#300" emissive="#ff2b2b" emissiveIntensity={1.5} />
              </mesh>
            )
          })}
        </group>
        <group ref={parts.lensRing}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[1.6, 0.2, 0]}>
            <torusGeometry args={[0.24, 0.05, 16, 48]} />
            <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
          </mesh>
        </group>
        <group ref={parts.lens}>
          <mesh position={[1.58, 0.2, 0]}>
            <sphereGeometry args={[0.22, 48, 48]} />
            <meshPhysicalMaterial color="#05122e" metalness={0.2} roughness={0} clearcoat={1} iridescence={1} iridescenceIOR={1.6} />
          </mesh>
        </group>
        {/* cable */}
        <group ref={parts.cable}>
          <mesh position={[-0.9, -0.3, 0]}>
            <torusGeometry args={[0.45, 0.04, 12, 48, Math.PI]} />{dark}
          </mesh>
        </group>
      </group>
    </Float>
  )
}
