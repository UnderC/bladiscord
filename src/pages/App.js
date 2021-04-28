import React from 'react'
import Pass from './Pass'

import {
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  CssBaseline,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  Input
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

import { connect } from 'react-redux'
import { actionCreators as fG } from '../redux/reducer/focusGuild'
import { actionCreators as fC } from '../redux/reducer/focusChannel'
import { actionCreators as pw } from "../redux/reducer/passwd"
import { actionCreators as gU } from "../redux/reducer/getUser"
import { actionCreators as gWS } from '../redux/reducer/ws'

import apiURL from '../api/const'

import SelGuild from './guild/selGuild';
import SelChannel from './guild/selChannel';
import Message from './guild/message';

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }, paper: {
    paddingBottom: 50,
  }, list: {
    marginBottom: theme.spacing(2),
  }, appBar: {
    top: 'auto',
    bottom: 0,
  }, grow: {
    flexGrow: 1,
  }, root: {
    margin: 0,
    padding: theme.spacing(2),
  }, closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }, topic: {
    padding: theme.spacing(2, 2, 0),
    display: 'inline-block',
    overflow: 'hidden',
    width: '300px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingTop: '0'
  }, topic2: {
    whiteSpace: 'pre',
    paddingTop: '0'
  }
}))

const App = (props) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [type, setType] = React.useState('')
  const { dispatch, focused, focusedChannel, ws, passwd } = props
  if (!passwd) return (<Pass />)

  const back = () => {
    if (focusedChannel) dispatch(fC(null))
    else if (focused) dispatch(fG(null))
    else {
      window.localStorage.removeItem('otoLogin')
      ws.close()
      window.location.reload()
    }
  }

  const send = () => {
    if (!focusedChannel) return
    fetch(`${apiURL}/channels/${focusedChannel.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `${passwd}`,
        'Content-Type': 'application/json'
      }, body: JSON.stringify(
        {
          tts: false,
          content: type
        }
      )
    }).then(console.log).catch(console.error)
    setType('')
  }

  const handleChange = (e) => {
    setType(e.target.value)
  }

  const handleUpload = (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    fetch(`${apiURL}/channels/${focusedChannel.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `${passwd}`
      }, body: formData
    }).then(console.log).catch(console.error)
  }

  return (
    <React.Fragment>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>
          #{focusedChannel?.name}
        </DialogTitle>
        <DialogContent className={classes.topic2}>
          {focusedChannel?.topic}
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon/>
          </IconButton>
        </DialogActions>
      </Dialog>

      <CssBaseline/>
      <Paper square className={classes.paper} style={{ position: 'fixed', zIndex: '2', width: '100%', height: '75px' }}>
        <Typography className={classes.text} variant='h5'>
          <IconButton
            onClick={back}
            edge='start'
            color='inherit'
          >
            <ArrowBackIcon/>
          </IconButton>
          <span onClick={() => setOpen(true)}>
            {focusedChannel?.name || (focused?.name || '선택된 서버 없음')}
          </span>
        </Typography>
      </Paper>
      <Paper square className={classes.paper} id='otoScr' style={{ paddingTop: '70px' }}>
        {
          !focused ? <SelGuild/> : (
            !focusedChannel ? <SelChannel/> : <Message/>
          )
        }
        <form action='upload' id='uploadForm' method='post' enctype='multipart/form-data'>
          <input onChange={handleUpload} type='file' name='file' id='file' style={{ display: 'none' }}/>
        </form>
      </Paper>
      
      <AppBar position='fixed' color='primary' style={{ top: 'auto', bottom: '0' }}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={() => document.all.file.click()}>
            <AddIcon/>
          </IconButton>
          <Input color='inherit' value={type} onChange={handleChange} style={{ display: 'inline-flex', flexGrow: '2' }}/>
          <IconButton onClick={send} edge='end' color='inherit'>
            <SendIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

// {user.user.username || 'unknown'}

function stateToProps (state) {
  return {
    ...state.focusGuild,
    ...state.focusChannel,
    ...state.getUser,
    ...state.passwd,
    ...state.gatewayWS
  }
}

export default connect(stateToProps)(App)
