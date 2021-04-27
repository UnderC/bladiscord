import React from 'react'
import { connect } from 'react-redux'
import apiURL from '../../api/const'

import {
  // Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton
} from '@material-ui/core'
import BugReportIcon from '@material-ui/icons/BugReport'
import MessageComp from './msgComponent'
import getMember from '../../structures/getMember'

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
  const [messages, setMsgs] = React.useState([])
  let otoScr = document.getElementById('otoScr')
  const { dispatch, focused, focusedChannel, user, passwd, ws } = props
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
  
  if (!messages.length) {
    fetch(`${apiURL}/channels/${focusedChannel.id}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `${passwd}`
      }
    }).then(res => {
      return res.json()
    }).then(r => {
      setMsgs(r.reverse())
      otoScrm()
    })
  }

  return (
    <React.Fragment>
      <IconButton>
        <BugReportIcon/>
      </IconButton>
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
    </React.Fragment>
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
