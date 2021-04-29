import React from 'react'
import { batch, connect } from 'react-redux'
import { gatewayURL } from '../../api/const'
import opcodes from '../../api/discord/opcodes'

import { actionCreators as gWS } from '../../redux/reducer/ws'
import { actionCreators as gU } from '../../redux/reducer/getUser'
import { actionCreators as pw } from '../../redux/reducer/passwd'
import { withRouter } from 'react-router-dom'
import Loading from '../default/components/loding'
import Login from './login'

const fakeProperties = {
  '$os': 'Browser',
  '$browser': 'Firefox',
  '$device': 'Blackberry Classic'
}

let send = (d, ws) => {
  ws?.send(JSON.stringify(d))
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
      intents: 32519
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
      if (r.code === 4004) window.localStorage.removeItem('otoLogin')
      __reject(r)
    }

    const ws = new WebSocket(gatewayURL)
    ws.handlers = []
    ws.seq = null

    ws.onerror = reject
    ws.onclose = reject

    ws.onmessage = (raw) => {
      const msg = JSON.parse(raw.data)
      // console.log(msg)

      ws.seq = msg.s || ws.seq
      if (msg.op === opcodes.gateway.hello) {
        makeHeartbeatInterval(ws, msg.d.heartbeat_interval)
        identify(ws, token)
      } else if (msg.op === opcodes.gateway.dispatch) {
        if (msg.t === 'READY') {
          resolve([ws, msg.d])
        }
      }
      ws.handlers.forEach(h => h(msg))
    }
  })
}

class WS extends React.Component {
  constructor (props) {
    super(props)
    this.login = this.login.bind(this)
    this.state = {
      loading: false
    }
  }

  login (token) {
    const { dispatch, user, ws } = this.props
    if (user) ws.close()
    if (token && !this.state.loading) {
      this.setState({ loading: true })
      makeConnection(token)
        .then(([ws, user]) => {
          batch(() => {
            dispatch(pw(token))
            dispatch(gWS(ws))
            dispatch(gU(user))
          })
          
          this.setState({ loading: false })
          this.props.history.push('/guilds')
        })
        .catch((r) => {
          this.setState({ loading: false })
          console.log(r)
        })
    }
  }

  render () {
    const { loading } = this.state
    return (
      loading ? <Loading open={loading}/> : <Login login={this.login}/>
    )
  }
}

const stateToProps = (state) => {
  return {
    ...state.getUser,
    ...state.gatewayWS
  }
}

export default withRouter(connect(stateToProps)(WS))