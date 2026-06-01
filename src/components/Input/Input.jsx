import React, { useId } from 'react'
import './Input.css'

const Input = React.forwardRef(function Input({
    label,
    type = 'text',
    ...props},
    ref){
        const id = useId()
    return(
        <div>
            {
                label && <label  htmlFor={id}>{label}</label>
            }
            <br/>
            <input type={type} ref={ref} id={id} {...props}/>
            </div>
    )

})

export default Input;
