import React from 'react'
import { batch, connect } from 'react-redux'
import { gatewayURL } from '../../api/const'
import opcodes from '../../api/discord/opcodes'

import { actionCreators as gWS } from '../../redux/reducer/ws'
import { actionCreators as gU } from '../../redux/reducer/getUser'
import { actionCreators as pw } from '../../redux/reducer/passwd'
import { useHistory, withRouter } from 'react-router-dom'
import Loading from '../default/components/loding'

const fakeProperties = {
  '$os': 'Blackberry OS 10.3.3',
  '$browser': 'Kiwi',
  '$device': 'Blackberry Classic'
}

let send = (d, ws) => {
  ws?.send(JSON.stringify(d))
  // console.log(JSON.stringify(d))
}

const identify = (ws, token) => {
  send({
    op: opcodes.gateway.identify,
    d: {
      token,
      properties: fakeProperties,
      presence: {
        status: 'online',
        afk: false
      },
      compress: false,
      large_threshold: 250,
      intents: 32767
    }
  }, ws)
}

const resume = (ws, token, seq) => {
  send({
    op: opcodes.gateway.resume,
    d: {
      token,
      seq,
      session_id: window.localStorage.getItem('session')
    }
  }, ws)
}

const makeHeartbeatInterval = (ws, interval) => {
  return setInterval(() => {
    send({ op: opcodes.gateway.heartbeat, d: ws.seq }, ws)
  }, interval)
}

const makeConnection = (token) => {
  return new Promise((resolve, __reject) => {
    const reject = (r) => {
      if (r?.code === 4004) window.localStorage.removeItem('otoLogin')
      __reject(r)
    }

    const ws = new WebSocket(gatewayURL)
    ws.handlers = []
    ws.seq = null

    ws.onerror = reject
    ws.onclose = reject

    ws.onmessage = (raw) => {
      const msg = JSON.parse(raw.data)
      console.log(msg)

      ws.seq = msg.s || ws.seq
      if (msg.op === opcodes.gateway.hello) {
        makeHeartbeatInterval(ws, msg.d.heartbeat_interval + Math.random())
        identify(ws, token)
      } else if (msg.op === opcodes.gateway.dispatch) {
        if (msg.t === 'READY') {
          window.localStorage.setItem('session', msg.d.session_id)
          resolve([ws, msg.d])
        }
      } else if (msg.op === opcodes.gateway.invalidSession) {
        resume(token)
      }
      ws.handlers.forEach(h => h(msg))
    }
  })
}

const WS = (props) => {
  const [loading, setLoading] = React.useState(false)
  const { dispatch, ws, passwd } = props
  const history = useHistory()
  const otoLogin = JSON.parse(window.localStorage.getItem('otoLogin'))

  const login = () => {
    if (passwd && !loading) {
      setLoading(true)
      makeConnection(passwd)
        .then(([ws, user]) => {
          batch(() => {
            dispatch(pw(passwd))
            dispatch(gWS(ws))
            dispatch(gU(user))
          })
          
          setLoading(false)
          history.push('/guilds')
        })
        .catch((r) => {
          setLoading(false)
          console.log(r)
        })
    }
  }
  
  if (otoLogin && passwd && !ws) login()

  return (
    <Loading open={loading}/>
  )
}

const stateToProps = (state) => {
  return {
    ...state.passwd,
    ...state.getUser,
    ...state.gatewayWS
  }
}

export default connect(stateToProps)(WS)
