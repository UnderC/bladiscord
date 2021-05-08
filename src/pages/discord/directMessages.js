import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton
} from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import Frame from '../frame'

import React from 'react'
import ChannelItem from './components/channelItem'

const SelDM = (props) => {
  const history = useHistory()
  const { dispatch, user } = props

  if (!user) {
    history.replace('/')
    return <></>
  }

  const dms = user.private_channels.map(g => {
    const name = g.type === 1 ?
      g.recipients[0].username :
      g.name || `${g.recipients.length}명의 그룹`
    const avatar = g.type === 3 ?
      `https://cdn.discordapp.com/channel-icons/${g.id}/${g.icon}.png?` :
      `https://cdn.discordapp.com/avatars/${g.recipients[0].id}/${g.recipients[0].avatar}.webp?size=128`

    return { ...g, name, avatar }
  }).sort((l, r) => Number(r.last_message_id) - Number(l.last_message_id))

  const handleGuild = (g) => {
    history.push(`/guild/${g.id}`)
  }

  const button = (
    <IconButton
      onClick={() => history.push('/settings')}
      edge='start'
      color='inherit'
    >
      <SettingsIcon/>
    </IconButton>
  )

  const content = (
    <List>
      {dms.map((g, i) => 
        <ChannelItem
          key={`listDM${i}`}
          name={g.name}
          avatar={g.avatar}
          url={`/dm/${g.id}`}
        />
      )}
    </List>
  )

  return (
    <Frame
      button={button}
      title='선택된 개인 메시지 채널이 없음'
      content={content}
    />
  )
}

const stateToProps = (state) => {
  return {
    ...state.getUser
  }
}

export default connect(stateToProps)(SelDM)
