import React from 'react'
import { useHistory } from 'react-router-dom'

import {
  AppBar,
  Toolbar,
  Paper,
  CssBaseline,
  Typography,
  IconButton
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import Menu from './menu'

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }, paper: {
    paddingTop: 60,
    paddingBottom: 40,
  }, btn: {
    marginRight: theme.spacing(2)
  }, title: {
    flexGrow: 1
  }
}))

const Frame = (props) => {
  const history = useHistory()
  const classes = useStyles()
  const [opened, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <Menu
        open={opened}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      />

      <AppBar position='fixed'>
        <Toolbar>
          <IconButton
            onClick={() => setOpen(true)}
            edge='start'
            color='inherit'
          >
            <MenuIcon/>
          </IconButton>
          <Typography className={classes.title} variant='h6'>
            { props.title }
          </Typography>
        </Toolbar>
      </AppBar>

      <CssBaseline/>
      <Paper
        square
        className={classes.paper}
        id='otoScr'
      >
        { props.content }
      </Paper>
      { props.appbar }
    </React.Fragment>
  )
}

export default Frame
