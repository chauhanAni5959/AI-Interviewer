import React from 'react'

const Scorer = ({user, setUser}) => {
  return (
    <div className="bg-black">
      {user.name}-{user.email}
    </div>
  )
}

export default Scorer
