import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Settings from './default/settings'
import SelDM from './discord/directMessages'
import Login from './discord/login'
import Message from './discord/message'
import SelChannel from './discord/selChannel'
import SelGuild from './discord/selGuild'
import WS from './discord/ws'
import Menu from './menu'

const Root = () => {
  const [opened, setOpen] = React.useState(false)

  return (
    <Router>
      <Route exact path='/' component={WS}/>
      <Route exact path='/' component={Login}/>
      <Route exact path='/dms' component={SelDM}/>
      <Route exact path='/guilds' component={SelGuild}/>
      <Route path='/guild/:gID' component={SelChannel}/>
      <Route path='/channel/:cID' component={Message}/>
      <Route exact path='/settings' component={Settings}/>
    </Router>
  )
}

export default Root
