import { connect } from "react-redux"
import apiFetch from '../../structures/apiFetch';
import {
  Paper,
  FormControl,
  FormLabel,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel
} from '@material-ui/core'
import React from "react";

const Tester = (props) => {
  const { passwd, user } = props
  const [method, setMethod] = React.useState('GET')
  const [url, setUrl] = React.useState('')
  const [data, setData] = React.useState('{}')

  const wa = () => {
    console.log(method, url, data)
    apiFetch(method, url, passwd, method === 'GET' ? { query: data } : { body: data })
    .then(e => e.json())
    .then(console.log)
  }

  const handleMethod = (e) => {
    console.log(e)
    setMethod(e.target.value)
  }

  const handleUrl = (e) => {
    setUrl(e.target.value)
  }

  const handleData = (e) => {
    setData(e.target.value)
  }

  return (
    <Paper>
      <FormControl component='fieldset'>
        <FormLabel component='legend'>Method</FormLabel>
        <RadioGroup onChange={handleMethod}>
          <FormControlLabel label='GET' value='GET' control={<Radio/>}/>
          <FormControlLabel label='POST' value='POST' control={<Radio/>}/>
        </RadioGroup>
      </FormControl>

      <FormControl>
        <FormLabel component='legend'>Data</FormLabel>
        <TextField value={url} onChange={handleUrl} label='url' variant='outlined'/>
        <TextField value={data} onChange={handleData} label='data' variant='outlined' multiline/>
      </FormControl>

      <Button onClick={wa} color='primary'>Send!</Button>
      <Button onClick={() => console.log(user)} color='secondary'>view</Button>
    </Paper>
  )
}

const stateToProps = (state) => {
  console.log(state)
  return {
    ...state.passwd,
    ...state.getUser
  }
}

const test = (props) => {
  return {
    ...props
  }
}

export default connect(stateToProps, test)(Tester)
