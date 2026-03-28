import React, { useEffect, useRef } from 'react'

class GridAnimation {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')

    this.options = {
      squareSize: options.squareSize || 40,
      borderColor: options.borderColor || 'rgba(188, 196, 210, 0.12)',
      hoverFillColor: options.hoverFillColor || 'rgba(216, 223, 235, 0.24)',
      hoverShadowColor: options.hoverShadowColor || 'rgba(182, 191, 205, 0.18)',
      trailDuration: options.trailDuration || 560,
      transitionDuration: options.transitionDuration || 180,
      vignetteColorStart:
        options.vignetteColorStart || 'rgba(8, 10, 14, 0.02)',
      vignetteColorEnd: options.vignetteColorEnd || 'rgba(8, 10, 14, 0.44)',
      isMobile: options.isMobile || false,
    }

    this.devicePixelRatio = window.devicePixelRatio || 1
    this.gridOffset = { x: 0, y: 0 }
    this.hoveredSquare = null
    this.trailSquares = new Map()
    this.currentOpacity = 0
    this.targetOpacity = 0
    this.animationFrameId = null
    this.lastTimestamp = 0

    this.handleResize = this.handleResize.bind(this)
    this.handlePointerMove = this.handlePointerMove.bind(this)
    this.handlePointerLeave = this.handlePointerLeave.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  init() {
    this.resizeCanvas()

    this.canvas.style.pointerEvents = 'none'

    window.addEventListener('resize', this.handleResize)
    window.addEventListener('mousemove', this.handlePointerMove)
    window.addEventListener('touchstart', this.handlePointerMove, {
      passive: true,
    })
    window.addEventListener('touchmove', this.handlePointerMove, {
      passive: true,
    })
    window.addEventListener('touchend', this.handlePointerLeave, {
      passive: true,
    })
    window.addEventListener('touchcancel', this.handlePointerLeave, {
      passive: true,
    })
    document.addEventListener('visibilitychange', this.handleVisibilityChange)

    this.animate()
  }

  handleResize() {
    this.resizeCanvas()
  }

  resizeCanvas() {
    const { width, height } = this.canvas.getBoundingClientRect()
    const nextWidth = Math.max(Math.floor(width * this.devicePixelRatio), 1)
    const nextHeight = Math.max(Math.floor(height * this.devicePixelRatio), 1)

    this.canvas.width = nextWidth
    this.canvas.height = nextHeight
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`

    this.context.setTransform(1, 0, 0, 1, 0, 0)
    this.context.scale(this.devicePixelRatio, this.devicePixelRatio)
  }

  getPointerPosition(event) {
    const rect = this.canvas.getBoundingClientRect()

    if (event.touches && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      }
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  isPointerInsideCanvas(x, y) {
    const width = this.canvas.width / this.devicePixelRatio
    const height = this.canvas.height / this.devicePixelRatio

    return x >= 0 && x <= width && y >= 0 && y <= height
  }

  resolveGridPosition(x, y) {
    const startX =
      Math.floor(this.gridOffset.x / this.options.squareSize) *
      this.options.squareSize
    const startY =
      Math.floor(this.gridOffset.y / this.options.squareSize) *
      this.options.squareSize

    return {
      x: Math.floor((x + this.gridOffset.x - startX) / this.options.squareSize),
      y: Math.floor((y + this.gridOffset.y - startY) / this.options.squareSize),
    }
  }

  handlePointerMove(event) {
    const { x, y } = this.getPointerPosition(event)

    if (!this.isPointerInsideCanvas(x, y)) {
      this.handlePointerLeave()
      return
    }

    const nextHoveredSquare = this.resolveGridPosition(x, y)

    if (
      this.hoveredSquare &&
      (this.hoveredSquare.x !== nextHoveredSquare.x ||
        this.hoveredSquare.y !== nextHoveredSquare.y)
    ) {
      this.addTrailSquare(this.hoveredSquare, 0.24)
    }

    this.hoveredSquare = nextHoveredSquare
    this.targetOpacity = this.options.isMobile ? 0.52 : 0.44
  }

  handlePointerLeave() {
    if (this.hoveredSquare) {
      this.addTrailSquare(this.hoveredSquare, 0.18)
    }

    this.hoveredSquare = null
    this.targetOpacity = 0
  }

  addTrailSquare(square, opacity) {
    const key = `${square.x},${square.y}`
    this.trailSquares.set(key, {
      ...square,
      opacity,
    })
  }

  updateAnimationState(timestamp) {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp
    }

    const deltaTime = timestamp - this.lastTimestamp
    this.lastTimestamp = timestamp

    if (this.currentOpacity !== this.targetOpacity) {
      const progress = Math.min(deltaTime / this.options.transitionDuration, 1)
      this.currentOpacity =
        this.currentOpacity +
        (this.targetOpacity - this.currentOpacity) * progress
    }

    for (const [key, trailSquare] of this.trailSquares.entries()) {
      trailSquare.opacity -= deltaTime / this.options.trailDuration

      if (trailSquare.opacity <= 0) {
        this.trailSquares.delete(key)
      }
    }
  }

  drawSquare(gridX, gridY, fillStyle, opacity = 1) {
    const width = this.canvas.width / this.devicePixelRatio
    const height = this.canvas.height / this.devicePixelRatio
    const startX =
      Math.floor(this.gridOffset.x / this.options.squareSize) *
      this.options.squareSize
    const startY =
      Math.floor(this.gridOffset.y / this.options.squareSize) *
      this.options.squareSize
    const squareX = Math.round(
      gridX * this.options.squareSize +
        startX -
        (this.gridOffset.x % this.options.squareSize)
    )
    const squareY = Math.round(
      gridY * this.options.squareSize +
        startY -
        (this.gridOffset.y % this.options.squareSize)
    )

    if (
      squareX < -this.options.squareSize ||
      squareX > width ||
      squareY < -this.options.squareSize ||
      squareY > height
    ) {
      return
    }

    this.context.save()
    this.context.globalAlpha = opacity
    this.context.shadowColor = this.options.hoverShadowColor
    this.context.shadowBlur = this.options.isMobile ? 14 : 20
    this.context.fillStyle = fillStyle
    this.context.fillRect(
      squareX,
      squareY,
      this.options.squareSize,
      this.options.squareSize
    )
    this.context.restore()
  }

  drawGrid() {
    const width = this.canvas.width / this.devicePixelRatio
    const height = this.canvas.height / this.devicePixelRatio

    this.context.setTransform(1, 0, 0, 1, 0, 0)
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.scale(this.devicePixelRatio, this.devicePixelRatio)

    const startX =
      Math.floor(this.gridOffset.x / this.options.squareSize) *
      this.options.squareSize
    const startY =
      Math.floor(this.gridOffset.y / this.options.squareSize) *
      this.options.squareSize

    for (const trailSquare of this.trailSquares.values()) {
      this.drawSquare(
        trailSquare.x,
        trailSquare.y,
        this.options.hoverFillColor,
        Math.max(trailSquare.opacity, 0)
      )
    }

    if (this.hoveredSquare) {
      this.drawSquare(
        this.hoveredSquare.x,
        this.hoveredSquare.y,
        this.options.hoverFillColor,
        Math.max(this.currentOpacity, 0)
      )
    }

    this.context.save()
    this.context.lineWidth = this.options.isMobile ? 0.95 : 0.72
    this.context.strokeStyle = this.options.borderColor

    for (
      let x = startX;
      x < width + this.options.squareSize;
      x += this.options.squareSize
    ) {
      for (
        let y = startY;
        y < height + this.options.squareSize;
        y += this.options.squareSize
      ) {
        const squareX = Math.round(
          x - (this.gridOffset.x % this.options.squareSize)
        )
        const squareY = Math.round(
          y - (this.gridOffset.y % this.options.squareSize)
        )

        this.context.strokeRect(
          squareX,
          squareY,
          this.options.squareSize,
          this.options.squareSize
        )
      }
    }
    this.context.restore()

    const vignetteGradient = this.context.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.sqrt(width ** 2 + height ** 2) / 2
    )
    vignetteGradient.addColorStop(0, this.options.vignetteColorStart)
    vignetteGradient.addColorStop(1, this.options.vignetteColorEnd)

    this.context.fillStyle = vignetteGradient
    this.context.fillRect(0, 0, width, height)
  }

  updateAnimation = (timestamp) => {
    this.updateAnimationState(timestamp)
    this.drawGrid()
    this.animationFrameId = window.requestAnimationFrame(this.updateAnimation)
  }

  animate() {
    this.animationFrameId = window.requestAnimationFrame(this.updateAnimation)
  }

  handleVisibilityChange() {
    if (document.hidden) {
      if (this.animationFrameId) {
        window.cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
      }
      return
    }

    if (!this.animationFrameId) {
      this.lastTimestamp = 0
      this.animate()
    }
  }

  destroy() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('mousemove', this.handlePointerMove)
    window.removeEventListener('touchstart', this.handlePointerMove)
    window.removeEventListener('touchmove', this.handlePointerMove)
    window.removeEventListener('touchend', this.handlePointerLeave)
    window.removeEventListener('touchcancel', this.handlePointerLeave)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }
}

function GridBackground() {
  const canvasReference = useRef(null)

  useEffect(() => {
    const canvasElement = canvasReference.current

    if (!canvasElement) {
      return undefined
    }

    const isMobileDevice =
      /Mobile|Android|iP(ad|hone|od)|Windows Phone|KFAPWI/i.test(
        navigator.userAgent
      )

    const gridAnimation = new GridAnimation(canvasElement, {
      squareSize: isMobileDevice ? 52 : 42,
      borderColor: isMobileDevice
        ? 'rgba(184, 193, 206, 0.14)'
        : 'rgba(184, 193, 206, 0.1)',
      hoverFillColor: isMobileDevice
        ? 'rgba(220, 227, 238, 0.26)'
        : 'rgba(220, 227, 238, 0.22)',
      hoverShadowColor: 'rgba(180, 190, 204, 0.16)',
      trailDuration: isMobileDevice ? 520 : 620,
      transitionDuration: isMobileDevice ? 140 : 190,
      vignetteColorStart: 'rgba(8, 10, 14, 0.02)',
      vignetteColorEnd: 'rgba(8, 10, 14, 0.48)',
      isMobile: isMobileDevice,
    })

    gridAnimation.init()

    return () => {
      gridAnimation.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasReference}
      className='gridCanvas'
      aria-hidden='true'
    />
  )
}

export default GridBackground
