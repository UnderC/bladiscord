import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { actionCreators as fG } from '../../redux/reducer/focusGuild'

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@material-ui/core'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import getMember from '../../structures/getMember'
import Frame from '../frame'

const makeWithCategory = (channels) => {
  const categories = [{ dummy: true, type: 4, id: null }]
    .concat(channels.filter(c => c.type === 4))

  for (let c of categories) {
    c.children = channels
      .filter(_c => _c.type !== 4 && (_c.parent_id || null) === c.id)
      .sort((l, r) => l.position - r.position)
      .sort((l, r) => l.type - r.type)
  }

  return categories
}

const mergePerm = (roles) => {
  return roles.map(r => r.permissions)
}

const getRoles = (member, guild) => {
  const result = guild.roles.filter(r => member.roles.includes(r.id))
  return [guild.roles[0], ...result]
}

const permFilter = (roles, channels, category) => {
  const permissions = mergePerm(roles)
  const roleIDs = roles.map(r => r.id)
  const filter = (c) => {
    const f = permissions.find(p => (p & 8) === 8)
    if (!isNaN(f)) return true
    
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
  if (!user) {
    history.replace('/')
    return <></>
  }
  
  const { gID } = useParams()
  const focused = user.guilds.find(g => g.id === gID)
  const roles = getRoles(getMember(focused, user.user.id), focused)
  const [expands, setExpands] = React.useState(
    JSON.parse(window.localStorage.getItem('channelExpands')) ||
    []
  )

  const handleChannel = (c) => {
    dispatch(fG(focused))
    history.push(`/channel/${c.id}`)
  }

  const expandCategory = (id, expanded) => {
    let result = []
    if (expanded && !expands.includes(id)) result = [...expands, id]
    else {
      const index = expands.findIndex(_id => _id === id)
      if (index >= 0) {
        const frontend = expands.slice(0, index)
        const backend = expands.slice(index + 1)
        result = [ ...frontend, ...backend ]
      }
    }

    setExpands(result)
    window.localStorage.setItem('channelExpands', JSON.stringify(result))
  }

  const content = (
    makeWithCategory(focused?.channels || []).map((c, i) => (
      <Accordion
        style={{ display: c.children.length ? '' : 'none' }}
        expanded={expands.includes(c.id || focused.id)}
        onChange={(e, v) => expandCategory(c.id || focused.id, v)}
        key={`listCategory${i}`}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography variant='h6'>{c.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {permFilter(roles, c.children, c).map((c, i) => (
              <ListItem
                button
                key={`listChan${i}`}
                onClick={() => handleChannel(c)}
              >
                <ListItemAvatar>
                  { c.type === 0 ? <FormatQuoteIcon/> : <VolumeUpIcon/> }
                </ListItemAvatar>
                <ListItemText primary={c.name}/>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    ))
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
