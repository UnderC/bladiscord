import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Settings from './default/settings'
import Message from './discord/message'
import selChannel from './discord/selChannel'
import selGuild from './discord/selGuild'
import StatusObserver from './discord/statusObserver'
import WS from './discord/ws'

const Root = () => {
  return (
    <Router>
      <StatusObserver/>
      <Route exact path='/' component={WS}/>
      <Route exact path='/guilds' component={selGuild}/>
      <Route path='/guild/:gID' component={selChannel}/>
      <Route path='/channel/:cID' component={Message}/>
      <Route exact path='/settings' component={Settings}/>
    </Router>
  )
}

export default Root