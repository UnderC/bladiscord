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
  const history = useHistory()
  const { dispatch, focused, user, passwd, ws } = props
  if (!user) {
    history.replace('/')
    return <></>
  }

  const isGuild = focused.channels
  const { cID } = useParams()
  const [error, setError] = React.useState(null)
  const [messages, setMsgs] = React.useState([])
  const focusedChannel = isGuild ? focused.channels?.find(c => c.id === cID) : focused
  
  let first = true
  let allowOto = true
  let otoScr

  const otoScrm = (e, y) => {
    if (e || allowOto) {
      if (!otoScr) otoScr = document.getElementById('otoScr')
      document.scrollingElement.scrollTo(0, y >= 0 ? y : otoScr?.scrollHeight)
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

  React.useEffect(() => {
    document.onscroll = () => {
      allowOto = (document.scrollingElement.scrollTop >= document.scrollingElement.scrollTopMax)
    }

    fetchMessages(passwd, focusedChannel.id, messages).then(r => {
      setMsgs(r)
    }).catch(r => {
      setError(r)
      first = false
    })

    return () => ws.handlers.splice(0, 1)
  }, [])

  if (first) {
    setTimeout(() => otoScrm(true), 50)
    first = true
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
          isGuild={isGuild}
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
