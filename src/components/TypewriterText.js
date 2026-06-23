import React, { useState, useEffect, useCallback } from 'react'

/**
 * 打字机效果组件
 * 支持循环切换多条文本，带光标闪烁效果
 */
const TypewriterText = ({
  texts = [],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  className = '',
  cursorClassName = '',
}) => {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const currentText = texts[textIndex] || ''

  useEffect(() => {
    if (!currentText) return

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseDuration)
      return () => clearTimeout(pauseTimer)
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
          if (displayText.length === currentText.length) {
            setIsPaused(true)
          }
        } else {
          setDisplayText(currentText.slice(0, displayText.length - 1))
          if (displayText.length === 0) {
            setIsDeleting(false)
            setTextIndex((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, isPaused, currentText, textIndex, typingSpeed, deletingSpeed, pauseDuration])

  if (!texts.length) return null

  return (
    <span className={className}>
      {displayText}
      <span className={`typewriter-cursor ${cursorClassName}`}>|</span>
      <style>{`
        .typewriter-cursor {
          display: inline-block;
          animation: typewriterBlink 0.8s step-end infinite;
          font-weight: 100;
          opacity: 0.7;
        }
        @keyframes typewriterBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}

export default TypewriterText
