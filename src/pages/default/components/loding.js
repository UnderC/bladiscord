import {
  Backdrop,
  CircularProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 1301, //theme.zIndex.drawer,
    color: '#fff'
  }
}))

const Loading = (props) => {
  const classes = useStyles()
  const { open } = props

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default Loading
