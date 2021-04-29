import { connect } from "react-redux"
import { useHistory } from 'react-router-dom'

import {
  Button
} from '@material-ui/core'
import ErrorDialog from "../default/components/error"
import React from "react"

const StatusObserver = (props) => {
  const history = useHistory()
  const { ws } = props
  const [open, setOpen] = React.useState(true)
  
  const handleRetry = () => {
    setOpen(false)
    history.push('/')
  }

  return (
    ws?.readyState === 3 ?
    (
      <ErrorDialog
        open={open}
        error={{
          message: (
            <React.Fragment>
              디스코드 서버와 연결이 끊어졌습니다.
              <br/>
              그래도 <u>진행</u>하시겠습니까?
            </React.Fragment>
          )
        }}
        
        actions={
          <React.Fragment>
            <Button onClick={() => setOpen(false)}>진행</Button>
            <Button onClick={handleRetry}>재접속</Button>
          </React.Fragment>
        }
      />
    ) :
    <></>
  )
}

const stateToProps = (state) => {
  return {
    ...state.gatewayWS
  }
}

export default connect(stateToProps)(StatusObserver)
