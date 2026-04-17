import React, { useEffect, useRef } from 'react'

const MouseParticleEffect = () => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight

    // 设置canvas尺寸
    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 粒子类
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = Math.random() * 0.3 + 0.1 // 轻微向下飘落
        this.opacity = Math.random() * 0.4 + 0.15
      }

      update() {
        // 向下飘落
        this.y += this.speedY
        
        // 水平漂浮
        this.x += this.speedX
        
        // 边界处理：超出底部则从顶部重新出现
        if (this.y > height) {
          this.y = -10
          this.x = Math.random() * width
        }
        
        // 左右边界循环
        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
      }

      draw(ctx) {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // 增加粒子数量，从200提升到800
    const particleCount = Math.min(800, Math.floor((width * height) / 3000))
    particlesRef.current = Array.from({ length: particleCount }, () => new Particle())

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // 更新和绘制粒子
      particlesRef.current.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      // 绘制粒子间的连线
      drawConnections(ctx)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // 绘制连接线（简化版）
    const drawConnections = (ctx) => {
      const particles = particlesRef.current
      const connectionDistance = 120 // 连接距离

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.save()
            ctx.globalAlpha = (1 - distance / connectionDistance) * 0.1
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    animate()

    // 清理
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.7,
      }}
    />
  )
}

export default MouseParticleEffect