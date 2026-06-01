import React from 'react'
import './Container.css'

function Container({children}) {
  return (
    <div className='Container'>
      {children}
    </div>
  )
}

export default Container;
