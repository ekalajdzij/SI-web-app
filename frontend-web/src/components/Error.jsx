import React from 'react'

function Error() {
  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      fontSize: '42px', 
      fontWeight: 'bold', 
      color: 'red', 
    }}>
      You have to sign in, or you do not have credidentials, to see this content 
    </div>
  )
}

export default Error
