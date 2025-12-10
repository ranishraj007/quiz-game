"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from "@react-three/drei"
import { Suspense } from "react"

function FloatingSphere({
  position,
  color,
  speed,
  scale,
}: {
  position: [number, number, number]
  color: string
  speed: number
  scale: number
}) {
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere args={[scale, 32, 32]} position={position}>
        <MeshDistortMaterial color={color} attach="material" distort={0.4} speed={2} roughness={0.2} metalness={0.8} />
      </Sphere>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#a78bfa" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />

      <FloatingSphere position={[-3, 1, -2]} color="#3b82f6" speed={1.5} scale={1.2} />
      <FloatingSphere position={[3, -1, -3]} color="#8b5cf6" speed={2} scale={0.8} />
      <FloatingSphere position={[0, 2, -4]} color="#ec4899" speed={1} scale={1} />
      <FloatingSphere position={[-2, -2, -1]} color="#10b981" speed={1.8} scale={0.6} />
      <FloatingSphere position={[2, 0, -2]} color="#f59e0b" speed={1.2} scale={0.9} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  )
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
