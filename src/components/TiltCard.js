import React, { useRef, useState, useCallback } from 'react'

/**
 * 卡片悬浮 3D 倾斜效果组件
 * 鼠标悬停时卡片会根据鼠标位置产生 3D 立体旋转效果
 */
const TiltCard = ({
  children,
  className = '',
  tiltDegree = 8,
  glareOpacity = 0.25,
  perspective = 1000,
  scale = 1.02,
  speed = 400,
  style = {},
}) => {
  const cardRef = useRef(null)
  const [tiltStyle, setTiltStyle] = useState({})
  const [glareStyle, setGlareStyle] = useState({})
  const [isHovered, setIsHovered] = useState(false)
  const transitionRef = useRef(null)

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      // 计算旋转角度
      const rotateX = (-mouseY / (rect.height / 2)) * tiltDegree
      const rotateY = (mouseX / (rect.width / 2)) * tiltDegree

      // 计算光晕位置
      const glareX = ((mouseX / (rect.width / 2)) * 50 + 50).toFixed(0)
      const glareY = ((mouseY / (rect.height / 2)) * 50 + 50).toFixed(0)

      if (transitionRef.current) {
        clearTimeout(transitionRef.current)
        transitionRef.current = null
      }

      setTiltStyle({
        transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: 'transform 0.1s ease-out',
      })

      setGlareStyle({
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
      })
    },
    [tiltDegree, perspective, scale, glareOpacity]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    
    transitionRef.current = setTimeout(() => {
      setTiltStyle({
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: `transform ${speed}ms ease`,
      })
      setGlareStyle({})
    }, 50)
  }, [perspective, speed])

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        display: 'inline-block',
        width: '100%',
        ...style,
      }}
    >
      <div
        className="tilt-card-inner"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'inherit',
          ...tiltStyle,
        }}
      >
        {children}
        {/* 光晕效果层 */}
        {isHovered && (
          <div
            className="tilt-card-glare"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 10,
              borderRadius: 'inherit',
              ...glareStyle,
            }}
          />
        )}
        {/* 边框高光 */}
        {isHovered && (
          <div
            className="tilt-card-border-glow"
            style={{
              position: 'absolute',
              inset: -1,
              borderRadius: 'inherit',
              border: '1px solid rgba(255,255,255,0.15)',
              pointerEvents: 'none',
              zIndex: 11,
              mask: 'linear-gradient(135deg, #000 0%, transparent 50%, #000 100%)',
              WebkitMask: 'linear-gradient(135deg, #000 0%, transparent 50%, #000 100%)',
            }}
          />
        )}
      </div>
    </div>
  )
}

export default TiltCard
