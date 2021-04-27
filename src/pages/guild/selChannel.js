import React from 'react'

import { connect } from 'react-redux'
import { actionCreators as fC } from '../../redux/reducer/focusChannel'

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
  console.log(roles)
  for (let role of roles) {
    bitwise &= ~Number(role.permissions)
  }

  return bitwise
}

const getRoles = (member, guild) => {
  const result = guild.roles.filter(r => member.roles.includes(r.id))
  return [guild.roles[0], ...result].sort((l, r) => l.position - r.position)
}

const permFilter = (roles, channels, category) => {
  // const permissions = mergePerm(roles)
  const roleIDs = roles.map(r => r.id)
  const filter = (c) => {
    // console.log('wa '+ permissions)
    // if ((permissions & 8) === 8) return true
    
    let not0 = false
    let result = 0
    console.log('================================')
    console.log(c.permission_overwrites)
    if (category.permission_overwrites) {
      const _owFilter = category.permission_overwrites.filter(ow => roleIDs.includes(ow.id))
      for (let ow of _owFilter) {
        if ((Number(ow.allow) || Number(ow.deny)) !== 0) not0 = true
        result |= Number(ow.allow)
        result &= ~Number(ow.deny)
      }
    }

    const owFilter = c.permission_overwrites.filter(ow => roleIDs.includes(ow.id))
    console.log(owFilter)
    for (let ow of owFilter) {
      if ((Number(ow.allow) || Number(ow.deny)) !== 0) not0 = true
      result |= Number(ow.allow)
      result &= ~Number(ow.deny)
    }

    console.log(result)
    return !not0 || ((result & 1024) === 1024) || ((result & 2048) === 2048) // result
  }

  const result = channels.filter(filter)
  return result
}

const SelChannel = (props) => {
  const classes = useStyles()
  const { dispatch, focused, user } = props
  const roles = getRoles(getMember(focused, user.user.id), focused)

  return (
    <List>
      {sortChannels(focused?.channels || []).map((c, i) => 
        (
          <React.Fragment>
            <ListSubheader key={`listCate${i}`} className={classes.subheader}>{c.name}</ListSubheader>
            {
              permFilter(roles, c.children, c).map((c, i) => (
                <ListItem
                  key={`listChan${i}`}
                  onClick={() => dispatch(fC(c))}
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
}

const stateToProps = (state) => {
  return {
    ...state.getUser,
    ...state.focusGuild
  }
}

export default connect(stateToProps)(SelChannel)
