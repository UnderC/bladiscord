import React from 'react'
import { useHistory } from 'react-router-dom'

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  SwipeableDrawer
} from '@material-ui/core'
import FlagIcon from '@material-ui/icons/Flag'
import ChatIcon from '@material-ui/icons/Chat'

const Menu = (props) => {
  const history = useHistory()
  const go = (loc) => {
    return () => {
      history.push(loc)
    }
  }

  return (
    <SwipeableDrawer
      anchor='bottom'
      {...props}
    >
      <List>
        <ListItem onClick={go('/settings')} button>
          <ListItemIcon><ChatIcon/></ListItemIcon>
          <ListItemText>
            설정
          </ListItemText>
        </ListItem>

        <ListItem onClick={go('/settings')} button>
          <ListItemIcon><ChatIcon/></ListItemIcon>
          <ListItemText>
            개인 메시지
          </ListItemText>
        </ListItem>

        <ListItem onClick={go('/guilds')} button>
          <ListItemIcon><FlagIcon/></ListItemIcon>
          <ListItemText>
            길드
          </ListItemText>
        </ListItem>
      </List>
    </SwipeableDrawer>
  )
}

export default Menu
