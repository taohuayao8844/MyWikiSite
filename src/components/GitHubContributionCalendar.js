import React, { useEffect, useRef, useState } from 'react'

const CALENDAR_SCRIPT_ID = 'github-calendar-script'
const CALENDAR_STYLE_ID = 'github-calendar-style'
const CALENDAR_STYLE_HREF =
  'https://cdn.jsdelivr.net/npm/github-calendar@latest/dist/github-calendar-responsive.css'
const CALENDAR_SCRIPT_SRC =
  'https://cdn.jsdelivr.net/npm/github-calendar@latest/dist/github-calendar.min.js'

function ensureCalendarStyleSheet() {
  if (document.getElementById(CALENDAR_STYLE_ID)) {
    return
  }

  const styleElement = document.createElement('link')
  styleElement.id = CALENDAR_STYLE_ID
  styleElement.rel = 'stylesheet'
  styleElement.href = CALENDAR_STYLE_HREF
  document.head.appendChild(styleElement)
}

function loadCalendarScript() {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(CALENDAR_SCRIPT_ID)

    if (existingScript) {
      if (typeof window.GitHubCalendar === 'function') {
        resolve(window.GitHubCalendar)
        return
      }

      existingScript.addEventListener('load', () => {
        resolve(window.GitHubCalendar)
      })
      existingScript.addEventListener('error', () => {
        reject(new Error('GitHubCalendar 脚本加载失败'))
      })
      return
    }

    const scriptElement = document.createElement('script')
    scriptElement.id = CALENDAR_SCRIPT_ID
    scriptElement.src = CALENDAR_SCRIPT_SRC
    scriptElement.async = true
    scriptElement.onload = () => {
      if (typeof window.GitHubCalendar === 'function') {
        resolve(window.GitHubCalendar)
        return
      }

      reject(new Error('GitHubCalendar 全局对象不存在'))
    }
    scriptElement.onerror = () => {
      reject(new Error('GitHubCalendar 脚本加载失败'))
    }

    document.body.appendChild(scriptElement)
  })
}

function GitHubContributionCalendar({
  username = 'taohuayao8844',
  className = '',
}) {
  const calendarContainerReference = useRef(null)
  const [hasLoadError, setHasLoadError] = useState(false)

  useEffect(() => {
    let isCancelled = false

    async function initializeCalendar() {
      if (!calendarContainerReference.current) {
        return
      }

      try {
        ensureCalendarStyleSheet()
        const GitHubCalendar = await loadCalendarScript()

        if (isCancelled || !calendarContainerReference.current) {
          return
        }

        calendarContainerReference.current.innerHTML = ''
        GitHubCalendar(calendarContainerReference.current, username, {
          responsive: true,
          tooltips: true,
          summary_text: '',
        })
      } catch (error) {
        if (!isCancelled) {
          setHasLoadError(true)
        }
      }
    }

    initializeCalendar()

    return () => {
      isCancelled = true
    }
  }, [username])

  return (
    <section className={className} aria-label='GitHub 贡献日历'>
      <div ref={calendarContainerReference} />

      {hasLoadError ? <div>GitHub 贡献图加载失败，请稍后重试。</div> : null}
    </section>
  )
}

export default GitHubContributionCalendar
