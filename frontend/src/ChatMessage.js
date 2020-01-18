import React from 'react'

export default ({ lineNumber, value, editor, onChangeFunc }) => {
  return(
    <p>
      <em>{lineNumber}</em>   
      <em>Edited by {editor}</em>
    <input type='text' defaultValue={value} onChange={onChangeFunc}></input>
  </p> 
  )
}
