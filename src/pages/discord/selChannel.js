import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { actionCreators as fG } from '../../redux/reducer/focusGuild'

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import getMember from '../../structures/getMember'
import Frame from '../frame'

const useStyles = makeStyles((theme) => ({
  subheader: {
    backgroundColor: theme.palette.background.paper,
  }
}))

const sortChannels = (channels) => {
  const categories = []

  for (let c of [{ dummy: true, type: 4, id: null }].concat(channels.filter(c => c.type === 4))) {
    c.children = channels
      .filter(_c => _c.type !== 4 && _c.parent_id === c.id)
      .sort((l, r) => l.position - r.position)
      .sort((l, r) => l.type - r.type)
    categories.push(c)
  }

  return categories
}

const mergePerm = (roles) => {
  let bitwise = 0
  for (let role of roles) {
    bitwise &= ~Number(role.permissions)
  }

  return bitwise
}

const getRoles = (member, guild) => {
  const result = guild.roles.filter(r => member.roles.includes(r.id))
  return [guild.roles[0], ...result]
}

const permFilter = (roles, channels, category) => {
  const permissions = mergePerm(roles.slice(1))
  const roleIDs = roles.map(r => r.id)
  const filter = (c) => {
    if ((permissions & 8) === 8) return true
    
    let result = 104324673
    const owFilter = c.permission_overwrites.filter(ow => roleIDs.includes(ow.id))

    if (category.permission_overwrites) {
      const _owFilter = category.permission_overwrites.filter(ow => roleIDs.includes(ow.id))
      for (let ow of _owFilter) {
        result &= ~Number(ow.deny)
        result |= Number(ow.allow)
      }
    }

    for (let ow of owFilter) {
      result &= ~Number(ow.deny)
      result |= Number(ow.allow)
    }

    return ((result & 1024) === 1024)
  }

  const result = channels.filter(filter)
  return result
}

const SelChannel = (props) => {
  const history = useHistory()
  const { dispatch, user } = props
  if (!user) history.goBack()
  
  const { gID } = useParams()
  const classes = useStyles()
  const focused = user.guilds.find(g => g.id === gID)
  const roles = getRoles(getMember(focused, user.user.id), focused)

  const handleChannel = (c) => {
    dispatch(fG(focused))
    history.push(`/channel/${c.id}`)
  }

  const content = (
    <List>
      {sortChannels(focused?.channels || []).map((c, i) => 
        (
          <React.Fragment>
            <ListSubheader key={`listCate${i}`} className={classes.subheader}>{c.name}</ListSubheader>
            {
              permFilter(roles, c.children, c).map((c, i) => (
                <ListItem
                  key={`listChan${i}`}
                  onClick={() => handleChannel(c)}
                >
                  <ListItemAvatar>
                    { c.type === 0 ? <FormatQuoteIcon/> : <VolumeUpIcon/> }
                  </ListItemAvatar>
                  <ListItemText primary={c.name}/>
                </ListItem>
              ))
            }
          </React.Fragment>
        )
      )}
    </List>
  )

  return (
    <Frame
      title={focused.name}
      content={content}
    />
  )
}

const stateToProps = (state) => {
  return {
    ...state.getUser
  }
}

export default connect(stateToProps)(SelChannel)
