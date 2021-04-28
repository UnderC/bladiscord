import React from 'react'
import { useHistory } from 'react-router-dom'

import {
  IconButton,
  Paper,
  CssBaseline,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }, paper: {
    paddingBottom: 50,
  }
}))

const Frame = (props) => {
  const history = useHistory()
  const classes = useStyles()

  return (
    <React.Fragment>
      <CssBaseline/>
      <Paper square className={classes.paper} style={{ position: 'fixed', zIndex: '2', width: '100%', height: '75px' }}>
        <Typography className={classes.text} variant='h5'>
          <IconButton
            onClick={() => history.goBack()}
            edge='start'
            color='inherit'
          >
            <ArrowBackIcon/>
          </IconButton>
          <span>
            { props.title }
          </span>
        </Typography>
      </Paper>
      <Paper
        square
        className={classes.paper}
        id='otoScr'
        style={{ paddingTop: '70px' }}
        // onLoad={{}}
      >
        { props.content }
      </Paper>
      { props.appbar }
    </React.Fragment>
  )
}

export default Frame
