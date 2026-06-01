import React from 'react'
import './Button.css';

function Button({
    children,
    type='button',
    color='Black',
    backgroundColor='lightblue',
    bgColor='',
  
    className='',
    style={},
    ...props
}) {
  const combinedClassName = [bgColor, className].filter(Boolean).join(' ');
  return (
    <button 
      type={type}
      className={combinedClassName || undefined}
      style={{
        color: color,
        backgroundColor: backgroundColor,
        ...style
      }}
      {...props}>
        {children} 
    </button>
  )
}

export default Button;
