import React from 'react'
import { connect } from 'react-redux'
import apiURL from '../../api/const'
import { useParams, useHistory } from 'react-router-dom'

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@material-ui/core'
import MessageComp from './components/msgComponent'
import getMember from '../../structures/getMember'
import Frame from '../frame'
import ErrorDialog from './components/error'
import ChatInput from './components/chatInput'

const sortMessages = (messages) => {
  const result = []

  let bef = null
  const filtered = messages.map(m => {
    let _bef = bef
    bef = m.author.id
    if (_bef !== m.author.id) return m.author
  })

  let startIndex = 0
  for (const m of filtered) {
    if (!m) continue

    const bef = m.id
    let swit = false
    
    const filtered = messages.filter((_m, i) => {
      if (swit || (startIndex > i)) return false
      else if (bef !== _m.author.id) {
        startIndex = i
        swit = true
        return false
      }
      
      return true
    })

    m.messages = filtered
    result.push(m)
  }

  return result
}

const Message = (props) => {
  let first = true
  const history = useHistory()
  const { dispatch, focused, user, passwd, ws } = props
  if (!user || !focused) history.goBack()

  const { cID } = useParams()
  const [error, setError] = React.useState(null)
  const [messages, setMsgs] = React.useState([])
  let otoScr = document.getElementById('otoScr')
  const focusedChannel = focused.channels.find(c => c.id === cID)
  
  let allowOto = true
  document.onscroll = () => {
    allowOto = (document.scrollingElement.scrollTop >= document.scrollingElement.scrollTopMax)
  }

  const otoScrm = () => {
    if (allowOto) {
      if (!otoScr) otoScr = document.getElementById('otoScr')
      document.scrollingElement.scrollTo(0, otoScr?.scrollHeight)
    }
  }

  ws.handlers[0] = (msg) => {
    if (msg.t === 'MESSAGE_CREATE') {
      if (msg.d.channel_id !== focusedChannel.id) return
      setMsgs([...messages, msg.d])
      otoScrm()
    }
  }
  
  if (!messages.length && !error) {
    fetch(`${apiURL}/channels/${focusedChannel.id}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `${passwd}`
      }
    }).then(res => {
      return res.json()
    }).then(r => {
      if (!Array.isArray(r)) setError(r)
      else setMsgs(r.reverse())
      // otoScrm()
    }).catch(e => {
      setError(e)
    })
  }
  
  if (messages.length && first) {
    setTimeout(otoScrm, 50)
    first = false
  }

  const content = (
    <List>
      {
        sortMessages(messages).map(m => (
          <ListItem style={{ alignItems: 'flex-start' }}>
            <ListItemAvatar>
              <Avatar src={`https://cdn.discordapp.com/avatars/${m.id}/${m.avatar}.webp?size=128`}/>
            </ListItemAvatar>
            <ListItemText
              primary={getMember(focused, m.id)?.nick || m.username}
              secondary={
                <React.Fragment>
                  {m.messages.map(v => (
                    <MessageComp message={v}/>
                  ))}
                </React.Fragment>
              }
            />
          </ListItem>
        ))
      }
    </List>
  )

  return (
    <Frame
      title={focusedChannel.name}
      content={
        !error ?
          content :
          (
            <ErrorDialog error={error}/>
          )
      }
      appbar={<ChatInput/>}
      // onLoad={otoScrm}
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
