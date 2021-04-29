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
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

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

  return (
    <React.Fragment>
      <AppBar position='fixed'>
        <Toolbar>
          { props.button || 
            (
              <IconButton
                onClick={() => history.goBack()}
                edge='start'
                color='inherit'
              >
                <ArrowBackIcon/>
              </IconButton>
            )
          }
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
