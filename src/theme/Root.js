import React from 'react'
import MenuHoverEffect from '../components/MenuHoverEffect'

// 这个组件会在每个页面的最外层渲染
export default function Root({ children }) {
  return (
    <>
      <MenuHoverEffect />
      {children}
    </>
  )
}
