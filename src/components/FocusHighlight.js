import React, { useEffect, useRef, useState } from 'react'

const FocusHighlight = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
      
      // 清除之前的timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // 2秒无移动后隐藏
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 2000)
    }

    const handleMouseEnter = () => {
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    const handleMouseOut = () => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseout', handleMouseOut)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* 焦点光晕 */}
      <div
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: isHovering ? '300px' : '200px',
          height: isHovering ? '300px' : '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: isVisible ? 1 : 0,
          transition: isHovering 
            ? 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease' 
            : 'opacity 0.5s ease',
          filter: 'blur(20px)',
        }}
      />
      
      {/* 微光点 */}
      <div
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: isHovering ? '8px' : '6px',
          height: isHovering ? '8px' : '6px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.9)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.2s ease',
          boxShadow: isHovering 
            ? '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4)' 
            : '0 0 6px rgba(255, 255, 255, 0.6)',
        }}
      />
    </>
  )
}

export default FocusHighlight
