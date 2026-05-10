declare module "three" {
  export class Mesh {
    rotation: { x: number; y: number; z: number }
    scale: { setScalar: (scale: number) => void }
  }

  export class Group {
    rotation: { x: number; y: number; z: number }
  }

  export class Shape {
    moveTo(x: number, y: number): void
    bezierCurveTo(
      cp1x: number,
      cp1y: number,
      cp2x: number,
      cp2y: number,
      x: number,
      y: number,
    ): void
  }
}
