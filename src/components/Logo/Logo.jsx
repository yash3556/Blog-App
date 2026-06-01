import React from 'react'
import './Logo.css'

function Logo({
  children,
  fontSizeIcon,
  fontSize,
  width,
  height,
  style={},
}) {
  return (
    <div className="logo">
      <div style={{fontSize:`${fontSizeIcon}px`,width:`${width}px`,height:`${height}px`,...style}} className="logo-icon">
        ✦
      </div>

      <h1 style={{fontSize:`${fontSize}px`,...style}}>Blogify</h1>
    </div>
  )
}

export default Logo;
