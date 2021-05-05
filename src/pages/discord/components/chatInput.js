import React from 'react'
import { useParams } from 'react-router-dom'

import {
  AppBar,
  Toolbar,
  IconButton,
  Input
} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';

import { connect } from 'react-redux'
import apiFetch from '../../../structures/apiFetch';

const ChatInput = (props) => {
  const [type, setType] = React.useState('')
  const { cID } = useParams()
  const { dispatch, passwd } = props

  const send = () => {
    if (!cID) return
    apiFetch(
      'POST',
      `channels/${cID}/messages`,
      passwd,
      { body: JSON.stringify({ tts: false, content: type })},
      { 'Content-Type': 'application/json' }
    ).then(() => setType(''))
    .catch(console.error)
  }

  const handleChange = (e) => {
    setType(e.target.value)
  }

  const handleUpload = (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    apiFetch(
      'POST',
      `channels/${cID}/messages`,
      passwd,
      { body: formData }
    ).then()
    .catch(console.error)
  }

  return (
    <AppBar position='fixed' color='primary' style={{ top: 'auto', bottom: '0' }}>
      <form action='upload' id='uploadForm' method='post' enctype='multipart/form-data'>
        <input onChange={handleUpload} type='file' name='file' id='file' style={{ display: 'none' }}/>
      </form>

      <Toolbar>
        <IconButton edge='start' onClick={() => document.all.file.click()}>
          <AddIcon/>
        </IconButton>
        <Input value={type} onChange={handleChange} style={{ display: 'inline-flex', flexGrow: '2' }}/>
        <IconButton onClick={send} edge='end' color='inherit'>
          <SendIcon/>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

function stateToProps (state) {
  return {
    ...state.passwd
  }
}

export default connect(stateToProps)(ChatInput)
