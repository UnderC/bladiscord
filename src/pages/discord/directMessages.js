import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { actionCreators as fG } from '../../redux/reducer/focusGuild'

import {
  List
} from '@material-ui/core'
import Frame from '../frame'

import React from 'react'
import ChannelItem from './components/channelItem'
import { privateChannel } from '../../structures/channel'

const SelDM = (props) => {
  const history = useHistory()
  const { dispatch, user } = props

  if (!user) {
    history.replace('/')
    return <></>
  }

  const handleDM = (g) => {
    dispatch(fG(g))
    history.push(`/channel/${g.id}`)
  }

  const dms = React.useMemo(
    () => user.private_channels.map(privateChannel)
      .sort((l, r) => Number(r.last_message_id) - Number(l.last_message_id))
  , [user.private_channels])

  const content = (
    <List>
      {dms.map((g, i) => 
        <ChannelItem
          key={`listDM${i}`}
          name={g.name}
          avatar={g.avatar}
          onClick={() => handleDM(g)}
        />
      )}
    </List>
  )

  return (
    <Frame
      title='선택된 개인 메시지 채널이 없음'
      content={content}
    />
  )
}

const stateToProps = (state) => {
  return {
    ...state.getUser,
    ...state.focusGuild
  }
}

export default connect(stateToProps)(SelDM)
