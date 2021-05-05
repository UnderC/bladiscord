import React from 'react'

import { useParams, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  List,
  IconButton
} from '@material-ui/core'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'

import ErrorDialog from '../default/components/error'
import Messages from './components/messages'
import ChatInput from './components/chatInput'
import Frame from '../frame'

import { fetchMessage, fetchMessages } from '../../structures/message'

const Message = (props) => {
  let first = true
  const history = useHistory()
  const { dispatch, focused, user, passwd, ws } = props
  if (!user || !focused) {
    history.replace('/')
    return <></>
  } 

  const { cID } = useParams()
  const [error, setError] = React.useState(null)
  const [messages, setMsgs] = React.useState([])
  let otoScr = document.getElementById('otoScr')
  const focusedChannel = focused.channels.find(c => c.id === cID)
  
  let allowOto = true
  document.onscroll = () => {
    allowOto = (document.scrollingElement.scrollTop >= document.scrollingElement.scrollTopMax)
  }

  const otoScrm = (e, y) => {
    try {
      if (e || allowOto) {
        if (!otoScr) otoScr = document.getElementById('otoScr')
        document.scrollingElement.scrollTo(0, y >= 0 ? y : otoScr?.scrollHeight)
      }
    } catch {
      console.log('일부 웹 기술이 지원되지 않아서 자동으로 스크롤 할 수 없었습니다.')
    }
  }

  const loadMore = () => {
    fetchMessages(
      passwd, focusedChannel.id, messages, messages[0].id
    ).then(messages => {
      setMsgs(messages)
      setTimeout(() => otoScrm(true, 0), 50)
    })
  }

  ws.handlers[0] = (msg) => {
    if (msg.t === 'MESSAGE_CREATE') {
      if (msg.d.channel_id !== focusedChannel.id) return
      console.log(msg.d)
      if (!msg.d.content.length) {
        fetchMessage(passwd, focusedChannel.id, msg.d.id)
          .then(m => setMsgs([...messages, m]))
      } else setMsgs([...messages, msg.d])
      otoScrm()
    }
  }
  
  if (!messages.length && !error && first) {
    fetchMessages(passwd, focusedChannel.id, messages).then(r => {
      setMsgs(r)
    }).catch(r => {
      setError(r)
      first = false
    })
  } else if (!error && first) {
    setTimeout(() => otoScrm(true), 50)
    first = false
  }

  const content = (
    <React.Fragment>
      <div style={{
        position: 'fixed',
        top: '4px',
        right: 0,
        display: 'flex',
        justifyContent: 'right',
        zIndex: 1101
      }}>
        <IconButton style={{ color: 'white' }}>
          <ArrowUpwardIcon onClick={loadMore}/>
        </IconButton>
        <IconButton style={{ color: 'white' }}>
          <ArrowDownwardIcon onClick={otoScrm}/>
        </IconButton>
      </div>
      <List>
        <Messages
          messages={messages}
          focused={focused}
        />
      </List>
    </React.Fragment>
  )

  return (
    <Frame
      title={focusedChannel.name}
      content={
        !error ?
          content :
          <ErrorDialog error={error}/>
      }
      appbar={<ChatInput/>}
    />
  )
}

const stateToProps = (state) => {
  return {
    ...state.focusChannel,
    ...state.focusGuild,
    ...state.getUser,
    ...state.passwd,
    ...state.gatewayWS
  }
}

export default connect(stateToProps)(Message)
