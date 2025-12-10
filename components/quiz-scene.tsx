"use client"

import type React from "react"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Sphere, Text } from "@react-three/drei"
import { Suspense, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function GlobeScene() {
  const globeRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.elapsedTime * 0.1
    }
  })

  return (
    <>
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.7} wireframe />
      </mesh>
      <Float speed={2} rotationIntensity={0.2}>
        <Sphere args={[0.1, 16, 16]} position={[2.5, 1, 0]}>
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3}>
        <Sphere args={[0.08, 16, 16]} position={[-2, 1.5, 1]}>
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
      <Float speed={1.8} rotationIntensity={0.25}>
        <Sphere args={[0.12, 16, 16]} position={[1.5, -1.5, 1.5]}>
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
    </>
  )
}

function VinylScene() {
  const vinylRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (vinylRef.current) {
      vinylRef.current.rotation.z = clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={vinylRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.05, 64]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]}>
        <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Grooves */}
      {[0.7, 1, 1.3, 1.6, 1.9].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.026]}>
          <torusGeometry args={[radius, 0.01, 8, 64]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function HeartScene() {
  const heartRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (heartRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.1
      heartRef.current.scale.setScalar(scale)
    }
  })

  // Create heart shape
  const heartShape = new THREE.Shape()
  const x = 0,
    y = 0
  heartShape.moveTo(x, y + 0.5)
  heartShape.bezierCurveTo(x, y + 0.5, x - 0.5, y, x - 0.5, y)
  heartShape.bezierCurveTo(x - 0.5, y - 0.5, x, y - 0.7, x, y - 1)
  heartShape.bezierCurveTo(x, y - 0.7, x + 0.5, y - 0.5, x + 0.5, y)
  heartShape.bezierCurveTo(x + 0.5, y, x, y + 0.5, x, y + 0.5)

  return (
    <mesh ref={heartRef} scale={2} rotation={[0, 0, Math.PI]}>
      <extrudeGeometry
        args={[heartShape, { depth: 0.4, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.1, bevelThickness: 0.1 }]}
      />
      <meshStandardMaterial color="#ef4444" metalness={0.3} roughness={0.5} />
    </mesh>
  )
}

function ScienceScene() {
  const atomRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (atomRef.current) {
      atomRef.current.rotation.y = clock.elapsedTime * 0.3
      atomRef.current.rotation.x = clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={atomRef}>
      {/* Nucleus */}
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
      </Sphere>

      {/* Electron orbits */}
      {[0, 60, 120].map((angle, i) => (
        <group key={i} rotation={[0, 0, (angle * Math.PI) / 180]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.5, 0.02, 16, 100]} />
            <meshStandardMaterial color="#60a5fa" metalness={0.5} />
          </mesh>
          <Float speed={3 + i} rotationIntensity={0}>
            <Sphere args={[0.1, 16, 16]} position={[1.5, 0, 0]}>
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.8} />
            </Sphere>
          </Float>
        </group>
      ))}
    </group>
  )
}

function HistoryScene() {
  return (
    <>
      {/* Ancient column */}
      <group position={[-2, -1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.35, 3, 16]} />
          <meshStandardMaterial color="#d4a574" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.7, 0]}>
          <boxGeometry args={[0.8, 0.3, 0.8]} />
          <meshStandardMaterial color="#d4a574" roughness={0.8} />
        </mesh>
      </group>

      <group position={[2, -1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.35, 3, 16]} />
          <meshStandardMaterial color="#d4a574" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.7, 0]}>
          <boxGeometry args={[0.8, 0.3, 0.8]} />
          <meshStandardMaterial color="#d4a574" roughness={0.8} />
        </mesh>
      </group>

      {/* Beam */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[5, 0.4, 0.6]} />
        <meshStandardMaterial color="#c4956a" roughness={0.8} />
      </mesh>

      <Float speed={1}>
        <Text position={[0, 0, 1]} fontSize={0.5} color="#f59e0b" font="/fonts/Inter_Bold.json">
          HISTORY
        </Text>
      </Float>
    </>
  )
}

function SceneContent({ category }: { category: string }) {
  const scenes: Record<string, React.ReactNode> = {
    geography: <GlobeScene />,
    music: <VinylScene />,
    health: <HeartScene />,
    science: <ScienceScene />,
    history: <HistoryScene />,
  }

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {scenes[category] || <GlobeScene />}

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      <Environment preset="night" />
    </>
  )
}

export function QuizScene({ category }: { category: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <Suspense fallback={null}>
        <SceneContent category={category} />
      </Suspense>
    </Canvas>
  )
}
