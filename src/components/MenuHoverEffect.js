import React, { useEffect, useRef, useState } from 'react'

const MenuHoverEffect = () => {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cursorRef = useRef(null)
  const animationFrameRef = useRef(null)
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const currentPositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetPositionRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseEnter = (e) => {
      const target = e.target
      if (
        target.classList.contains('navbar__link') ||
        target.classList.contains('menu__link') ||
        target.classList.contains('dropdown__link') ||
        target.classList.contains('clean-btn')
      ) {
        setIsHovering(true)
        setIsActive(true)
        
        const rect = target.getBoundingClientRect()
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        })
        setSize({
          width: rect.width,
          height: rect.height
        })
        
        // 立即更新当前位置
        currentPositionRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        }
      }
    }

    const handleMouseLeave = (e) => {
      if (
        e.target.classList.contains('navbar__link') ||
        e.target.classList.contains('menu__link') ||
        e.target.classList.contains('dropdown__link') ||
        e.target.classList.contains('clean-btn')
      ) {
        setIsHovering(false)
        
        // 延迟隐藏，给移动动画时间
        setTimeout(() => {
          if (!isHovering) {
            setIsActive(false)
          }
        }, 300)
      }
    }

    // 添加事件监听器
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    // 动画循环
    const animate = () => {
      if (isHovering) {
        // 当悬停在菜单项上时，跟随菜单项中心
        // 当前位置向目标位置缓动
        const dx = targetPositionRef.current.x - currentPositionRef.current.x
        const dy = targetPositionRef.current.y - currentPositionRef.current.y
        
        currentPositionRef.current.x += dx * 0.1
        currentPositionRef.current.y += dy * 0.1
        
        setPosition(currentPositionRef.current)
      } else {
        // 当未悬停时，跟随鼠标
        const dx = targetPositionRef.current.x - currentPositionRef.current.x
        const dy = targetPositionRef.current.y - currentPositionRef.current.y
        
        currentPositionRef.current.x += dx * 0.05
        currentPositionRef.current.y += dy * 0.05
        
        setPosition(currentPositionRef.current)
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // 清理
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isHovering])

  return (
    <>
      {/* 跟随光标 */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: isHovering ? `${Math.max(size.width, 40)}px` : '20px',
          height: isHovering ? `${Math.max(size.height, 20)}px` : '20px',
          borderRadius: isHovering ? '12px' : '50%',
          background: 'transparent',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isActive ? 0 : 0,
          transition: isHovering
            ? 'width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, opacity 0.3s ease'
            : 'opacity 0.3s ease',
          border: 'none',
          boxShadow: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        }}
      />
      
      {/* 光晕效果 */}
      <div
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: isHovering ? `${Math.max(size.width, 40) * 1.5}px` : '40px',
          height: isHovering ? `${Math.max(size.height, 20) * 1.5}px` : '40px',
          borderRadius: isHovering ? '18px' : '50%',
          background: 'transparent',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0,
          transition: isHovering
            ? 'width 0.4s ease, height 0.4s ease, border-radius 0.4s ease, opacity 0.4s ease'
            : 'opacity 0.4s ease',
          filter: 'none',
        }}
      />
    </>
  )
}

export default MenuHoverEffect
