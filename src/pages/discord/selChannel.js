import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { actionCreators as fG } from '../../redux/reducer/focusGuild'

import {
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getGuildMember, getGuildRoles } from '../../structures/guild'
import Frame from '../frame'
import { channelPermFilter, makeWithCategory } from '../../structures/channel'
import ChannelItem from './components/channelItem'

const SelChannel = (props) => {
  console.log(props)
  const history = useHistory()
  const { dispatch, user } = props
  if (!user) {
    history.replace('/')
    return <></>
  }

  const { gID } = useParams()
  const focused = user.guilds.find(g => g.id === gID)
  const roles = getGuildRoles(getGuildMember(focused, user.user.id), focused)
  const [expands, setExpands] = React.useState(
    JSON.parse(window.localStorage.getItem('channelExpands')) ||
    []
  )

  if (props?.focused?.id !== focused.id) dispatch(fG(focused))

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
            {channelPermFilter(roles, c.children, c).map((c, i) => (
              <ChannelItem
                name={c.name}
                url={`/channel/${c.id}`}
              />
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
    ...state.getUser,
    ...state.focusGuild
  }
}

export default connect(stateToProps)(SelChannel)
