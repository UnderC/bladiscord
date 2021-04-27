import { connect } from 'react-redux'
import { actionCreators as fG } from '../../redux/reducer/focusGuild'

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@material-ui/core'

const SelGuild = (props) => {
  const { dispatch, user } = props

  return (
    <List>
      {user.guilds.map((g, i) => 
        <ListItem
          key={`listG${i}`}
          onClick={() => dispatch(fG(g))}
        >
          <ListItemAvatar>
            <Avatar alt={g.name} src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp?size=128`}/>
          </ListItemAvatar>
          <ListItemText primary={g.name}/>
        </ListItem>
      )}
    </List>
  )
}

const stateToProps = (state) => {
  return {
    ...state.focusGuild,
    ...state.getUser
  }
}

export default connect(stateToProps)(SelGuild)
