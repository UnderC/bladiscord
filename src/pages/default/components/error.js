import { useHistory } from 'react-router-dom'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core'

const ErrorDialog = (props) => {
  const history = useHistory()
  const { error, open } = props

  return (
    <Dialog open={open || true}>
      <DialogTitle>
        오류가 발생했습니다
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ wordBreak: 'keep-all' }}>
          {error.code ? `[${error.code}] ` : ''}{error.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {
          props.actions ||
          (<Button onClick={() => history.goBack()}>이전</Button>)
        }
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog
