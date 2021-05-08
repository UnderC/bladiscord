import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton
} from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Frame from '../frame'

import React from 'react'
import ChannelItem from './components/channelItem'

const makeWithFolder = (user) => {
  const folders = user.user_settings.guild_folders
  for (const folder of folders) {
    folder.guilds = folder.guild_ids.map(
      gID => user.guilds.find(g => g.id === gID)
    )
  }

  return folders
}

const SelGuild = (props) => {
  const history = useHistory()
  const { dispatch, user } = props
  const [expands, setExpands] = React.useState(
    JSON.parse(window.localStorage.getItem('guildExpands')) ||
    []
  )

  if (!user) {
    history.replace('/')
    return <></>
  }

  const folders = makeWithFolder(user)
  const expandFolder = (id, expanded) => {
    let result = []
    if (expanded && !expands.includes(id)) result = [...expands, id]
    else {
      const index = expands.findIndex(_id => _id === id)
      if (index >= 0) {
        const frontend = expands.slice(0, index)
        const backend = expands.slice(index + 1, expands.length)
        result = [ ...frontend, ...backend ]
      }
    }

    setExpands(result)
    window.localStorage.setItem('guildExpands', JSON.stringify(result))
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
    folders.map((f, i) => (
      <Accordion
        expanded={expands.includes(f.id)}
        onChange={(e, v) => expandFolder(f.id, v)}
        key={`listFolder${i}`}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography variant='h6'>{f.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {f.guilds.map((g, i) => 
              <ChannelItem
                avatar={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp?size=128`}
                name={g.name}
                url={`/guild/${g.id}`}
              />
            )}
          </List>
        </AccordionDetails>
      </Accordion>
    ))
  )

  return (
    <Frame
      button={button}
      title='선택된 서버가 없음'
      content={content}
    />
  )
}

const stateToProps = (state) => {
  return {
    ...state.getUser
  }
}

export default connect(stateToProps)(SelGuild)
