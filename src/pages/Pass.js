import React from 'react'

import {
  Button,
  Input,
  FormControl,
  FormHelperText,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Backdrop,
  CircularProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import { connect } from 'react-redux'
import { actionCreators as gWS } from '../redux/reducer/ws'
import { actionCreators as pw } from "../redux/reducer/passwd"
import { actionCreators as gU } from "../redux/reducer/getUser"

import { gatewayURL } from '../api/const'
import opcodes from '../api/discord/opcodes'

var seq = null

const fakeProperties = {
  "$os": "Browser",
  "$browser": "Firefox",
  "$device": "Blackberry Classic"
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))

const immutableOtoLogin = Boolean(window.localStorage.getItem('otoLogin') || false)

const Pass = (props) => {
  const classes = useStyles()
  const { dispatch, ws } = props
  const [otoLogin, setOtoLogin] = React.useState(immutableOtoLogin)
  const [token, setToken] = React.useState(window.localStorage.getItem('token') || '')
  const [load, setLoad] = React.useState(false)

  let send = (d, _ws) => {
    if (ws || _ws) (ws || _ws).send(JSON.stringify(d))
  }

  const handleClick = () => {
    if (ws || load) return
    setLoad(true)
    window.localStorage.setItem('token', token)
    if (otoLogin !== immutableOtoLogin) window.localStorage.setItem('otoLogin', otoLogin)

    const wss = new WebSocket(gatewayURL)
    wss.onerror = () => {
      window.localStorage.removeItem('otoLogin')
      window.location.reload()
    }
    wss.onclose = (...args) => {
      console.log(...args)
      window.localStorage.removeItem('otoLogin')
      window.location.reload()
    }
    wss.onopen = () => {}
    wss.handlers = []

    wss.onmessage = (raw) => {
      const msg = JSON.parse(raw.data)
      // console.log(msg)

      seq = msg.s || seq
      if (msg.op === opcodes.gateway.hello) {
        setInterval(() => {
          send({ op: opcodes.gateway.heartbeat, d: seq }, wss)
          console.log('heartbeat ' + seq)
        }, msg.d.heartbeat_interval + Math.random())

        send({
          op: opcodes.gateway.identify,
          d: {
            token,
            properties: fakeProperties,
            presence: {
              status: 'dnd',
              afk: false
            },
            compress: false,
            large_threshold: 250,
            intents: 32519
          }
        }, wss)
      } else if (msg.op === opcodes.gateway.dispatch) {
        if (msg.t === 'READY') {
          dispatch(gU(msg.d))
          dispatch(pw(token))
        }
      }

      wss.handlers.forEach(h => h(msg))
    }

    dispatch(gWS(wss))
  }

  console.log(load, token, immutableOtoLogin)
  if (immutableOtoLogin && token && !load) {
    handleClick()
  }

  function close () {
    if (!ws) return window.close()
    ws.close()
    dispatch(gWS(null))
  }

  function handleChange (e) {
    setToken(e.target.value)
  }

  function checkHandle (e) {
    setOtoLogin(e.target.checked)
  }

  return (
    load ?
      (
        <Backdrop className={classes.backdrop} open={load}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) :
      (
        <Dialog open={true}>
        <DialogTitle>BlaDiscord</DialogTitle>

        <DialogContent>
          <FormControl>
            <InputLabel htmlFor="token">토큰</InputLabel>
            <Input value={token} aria-describedby="tokenHelperTxt" onChange={handleChange} id="token"/>
            <FormHelperText id="tokenHelperTxt">토큰 정보는 서버로 전송되지 않습니다</FormHelperText>

            <FormControlLabel
              control={
                <Checkbox
                  checked={otoLogin}
                  onChange={checkHandle}
                  name="otoLogin"
                  color="primary"
                />
              }
              label="자동 로그인"
            />
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={close}>
            <Close/>
          </Button>
          <Button color='primary' onClick={handleClick}>
            <ArrowForwardIcon/>
          </Button>
        </DialogActions>
      </Dialog>
    )
  )
}

const stateToProps = (state) => {
  return {
    ...state.passwd,
    ...state.gatewayWS
  }
}

export default connect(stateToProps)(Pass)
