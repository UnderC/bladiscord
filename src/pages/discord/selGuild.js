import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@material-ui/core'
import Frame from '../frame';

const SelGuild = (props) => {
  const history = useHistory()
  const { dispatch, user } = props

  if (!user || !user.guilds) history.goBack()
  const handleGuild = (g) => {
    history.push(`/guild/${g.id}`)
  }

  const content = (
    <List>
      {user.guilds.map((g, i) => 
        <ListItem
          key={`listG${i}`}
          onClick={() => handleGuild(g)}
        >
          <ListItemAvatar>
            <Avatar alt={g.name} src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp?size=128`}/>
          </ListItemAvatar>
          <ListItemText primary={g.name}/>
        </ListItem>
      )}
    </List>
  )

  return (
    <Frame
      title='선택된 서버 없음'
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
