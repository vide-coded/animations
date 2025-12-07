/**
 * Rotating Cubes Animation
 * 3D rotating cubes with perspective projection
 */

import type { Animation } from '../../../types/animation'
import type { AnimationContext } from '../../canvas/engine'

interface Point3D {
  x: number
  y: number
  z: number
}

interface Cube {
  position: Point3D
  rotation: Point3D
  rotationSpeed: Point3D
  size: number
  color: string
}

export class RotatingCubesAnimation implements Animation {
  name = 'Rotating Cubes'
  private cubes: Cube[] = []
  private readonly cubeCount = 12

  init(context: AnimationContext): void {
    const { width, height } = context
    this.cubes = []

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

    for (let i = 0; i < this.cubeCount; i++) {
      this.cubes.push({
        position: {
          x: (Math.random() - 0.5) * width * 0.8,
          y: (Math.random() - 0.5) * height * 0.8,
          z: Math.random() * 500,
        },
        rotation: {
          x: Math.random() * Math.PI * 2,
          y: Math.random() * Math.PI * 2,
          z: Math.random() * Math.PI * 2,
        },
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        size: 30 + Math.random() * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
  }

  update(context: AnimationContext): void {
    const { deltaTime } = context
    const dt = deltaTime / 16

    for (const cube of this.cubes) {
      cube.rotation.x += cube.rotationSpeed.x * dt
      cube.rotation.y += cube.rotationSpeed.y * dt
      cube.rotation.z += cube.rotationSpeed.z * dt
    }
  }

  render(context: AnimationContext): void {
    const ctx = context.ctx as CanvasRenderingContext2D
    const { width, height } = context

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2

    // Sort cubes by depth
    const sortedCubes = [...this.cubes].sort((a, b) => b.position.z - a.position.z)

    for (const cube of sortedCubes) {
      this.drawCube(ctx, cube, centerX, centerY)
    }
  }

  private drawCube(
    ctx: CanvasRenderingContext2D,
    cube: Cube,
    centerX: number,
    centerY: number
  ): void {
    const size = cube.size

    // Define cube vertices
    const vertices: Point3D[] = [
      { x: -size, y: -size, z: -size },
      { x: size, y: -size, z: -size },
      { x: size, y: size, z: -size },
      { x: -size, y: size, z: -size },
      { x: -size, y: -size, z: size },
      { x: size, y: -size, z: size },
      { x: size, y: size, z: size },
      { x: -size, y: size, z: size },
    ]

    // Rotate and project vertices
    const projected = vertices.map((v) => {
      // Rotate around X axis
      let y = v.y * Math.cos(cube.rotation.x) - v.z * Math.sin(cube.rotation.x)
      let z = v.y * Math.sin(cube.rotation.x) + v.z * Math.cos(cube.rotation.x)

      // Rotate around Y axis
      let x = v.x * Math.cos(cube.rotation.y) + z * Math.sin(cube.rotation.y)
      z = -v.x * Math.sin(cube.rotation.y) + z * Math.cos(cube.rotation.y)

      // Rotate around Z axis
      const xNew = x * Math.cos(cube.rotation.z) - y * Math.sin(cube.rotation.z)
      const yNew = x * Math.sin(cube.rotation.z) + y * Math.cos(cube.rotation.z)

      // Translate
      x = xNew + cube.position.x
      y = yNew + cube.position.y
      z = z + cube.position.z

      // Perspective projection
      const scale = 800 / (800 + z)

      return {
        x: centerX + x * scale,
        y: centerY + y * scale,
        scale,
      }
    })

    // Define faces
    const faces = [
      [0, 1, 2, 3], // Front
      [5, 4, 7, 6], // Back
      [4, 5, 1, 0], // Top
      [3, 2, 6, 7], // Bottom
      [4, 0, 3, 7], // Left
      [1, 5, 6, 2], // Right
    ]

    // Draw faces
    for (const face of faces) {
      const avgZ = face.reduce((sum, i) => sum + projected[i].scale, 0) / 4

      ctx.save()
      ctx.globalAlpha = 0.6 + avgZ * 0.4

      ctx.beginPath()
      ctx.moveTo(projected[face[0]].x, projected[face[0]].y)

      for (let i = 1; i < face.length; i++) {
        ctx.lineTo(projected[face[i]].x, projected[face[i]].y)
      }

      ctx.closePath()
      ctx.fillStyle = cube.color
      ctx.fill()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3
      ctx.stroke()

      ctx.restore()
    }
  }

  cleanup(): void {
    this.cubes = []
  }
}

export default new RotatingCubesAnimation()
