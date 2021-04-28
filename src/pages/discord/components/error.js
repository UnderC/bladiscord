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
  const { error } = props

  return (
    <Dialog open={true}>
      <DialogTitle>
        오류가 발생했습니다
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          [{error.code}] {error.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => history.goBack()}>이전</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog
