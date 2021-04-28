import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Message from './discord/message'
import selChannel from './discord/selChannel'
import selGuild from './discord/selGuild'
import Pass from './Pass'

const Root = () => {
  return (
    <Router>
      <Route exact path='/' component={Pass}/>
      <Route exact path='/guilds' component={selGuild}/>
      <Route path='/guild/:gID' component={selChannel}/>
      <Route path='/channel/:cID' component={Message}/>
    </Router>
  )
}

export default connect(() => ({}))(Root)
