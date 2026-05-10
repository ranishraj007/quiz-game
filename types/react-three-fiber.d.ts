declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any
      pointLight: any
      mesh: any
      group: any
      sphereGeometry: any
      cylinderGeometry: any
      boxGeometry: any
      torusGeometry: any
      extrudeGeometry: any
      meshStandardMaterial: any
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any
      pointLight: any
      mesh: any
      group: any
      sphereGeometry: any
      cylinderGeometry: any
      boxGeometry: any
      torusGeometry: any
      extrudeGeometry: any
      meshStandardMaterial: any
    }
  }
}

export {}
