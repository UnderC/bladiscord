import { useHistory } from 'react-router-dom'

import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@material-ui/core'

import React from 'react'

const ChannelItem = (props) => {
  const history = useHistory()
  const { name, avatar, url } = props
  const handle = () => history.push(url)

  return (
    <ListItem
      button
      onClick={handle}
    >
      <ListItemAvatar>
        <Avatar
          alt={name}
          src={avatar}
        />
      </ListItemAvatar>
      <ListItemText primary={name}/>
    </ListItem>
  )
}

export default React.memo(ChannelItem)
