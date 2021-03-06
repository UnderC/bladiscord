import React from 'react'
import { useHistory } from 'react-router-dom'

import { connect } from 'react-redux'
import { actionCreators as pw } from '../../redux/reducer/passwd'

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

} from '@material-ui/core'
import Close from '@material-ui/icons/Close'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

let firstRun = true

const Login = (props) => {
  const { dispatch } = props
  const [otoLogin, setOtoLogin] = React.useState((
    JSON.parse(window.localStorage.getItem('otoLogin')) ||
    false
  ))
  const [token, setToken] = React.useState(
    window.localStorage.getItem('token') ||
    ''
  )

  const handleToken = (e) => setToken(e.target.value)
  const handleOtoLogin = (e) => setOtoLogin(e.target.checked)
  const login = () => {
    window.localStorage.setItem('token', token)
    window.localStorage.setItem('otoLogin', otoLogin)
    
    dispatch(pw(token))
    firstRun = false
  }

  if (firstRun && otoLogin && token.length) login()

  return (
    <Dialog open={true}>
      <DialogTitle>BlaDiscord</DialogTitle>

      <DialogContent>
        <FormControl>
          <InputLabel htmlFor='token'>토큰</InputLabel>
          <Input
            type='password'
            value={token}
            aria-describedby='tokenHelperTxt'
            onChange={handleToken}
            id='token'
          />
          <FormHelperText id='tokenHelperTxt'>토큰 정보는 서버로 전송되지 않습니다</FormHelperText>

          <FormControlLabel
            control={
              <Checkbox
                checked={otoLogin}
                onChange={handleOtoLogin}
                name='otoLogin'
                color='primary'
              />
            }
            label='자동 로그인'
          />
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button color='primary' onClick={login}>
          <ArrowForwardIcon/>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default connect(() => ({}))(Login)
