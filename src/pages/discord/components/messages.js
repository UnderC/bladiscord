import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@material-ui/core'
import React from 'react'

import { getGuildMember } from '../../../structures/guild'
import { sortMessages } from "../../../structures/message"
import MessageComp from './msgComponent'

const Messages = (props) => {
  const { messages, focused, isGuild } = props
  return (
    sortMessages(messages).map(m => (
      <ListItem style={{ alignItems: 'flex-start' }}>
        <ListItemAvatar>
          <Avatar src={`https://cdn.discordapp.com/avatars/${m.id}/${m.avatar}.webp?size=128`}/>
        </ListItemAvatar>
        <ListItemText
          primary={getGuildMember(focused, m.id)?.nick || m.username}
          secondary={
            <React.Fragment>
              {m.messages.map(v => (
                <MessageComp
                  content={v.content}
                  attachments={v.attachments}
                />
              ))}
            </React.Fragment>
          }
        />
      </ListItem>
    ))
  )
}

export default React.memo(Messages)
