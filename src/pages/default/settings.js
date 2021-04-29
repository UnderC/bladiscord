import React from 'react'
import { useHistory } from 'react-router-dom'

import { batch, connect } from 'react-redux'
import { actionCreators as gWS } from '../../redux/reducer/ws'
import { actionCreators as gU } from '../../redux/reducer/getUser'

import Frame from '../frame'
import UserCard from './components/userCard'

const Settings = (props) => {
  const history = useHistory()
  const { dispatch, user, ws } = props
  if (!user || !ws) {
    history.replace('/')
    return <></>
  }

  const handleLogout = () => {
    window.localStorage.removeItem('otoLogin')
    ws.close()
    batch(() => {
      dispatch(gWS(null))
      dispatch(gU(null))
    })
  }

  const content = (
    <UserCard
      user={user}
      handleLogout={handleLogout}
    />
  )

  return (
    <Frame
      title='설정'
      content={content}
    />
  )
}

const stateToProps = (state) => {
  return {
    ...state.getUser,
    ...state.gatewayWS
  }
}

export default connect(stateToProps)(Settings)
