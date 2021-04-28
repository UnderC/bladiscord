import React from 'react'

import {
  IconButton,
  Card,
  CardHeader,
  CardMedia
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GetAppIcon from '@material-ui/icons/GetApp'
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    marginTop: '10px'
  }
})

const handleDownload = (url) => {
  window.open(url)
}

const MessageComp = (props) => {
  const classes = useStyles()
  const { message } = props

  // console.log(message?.attachments)

  return (
    <React.Fragment>
      <div style={{ wordBreak: 'break-all' }}>
        { message.content.startsWith('http') ? <a href={message.content}>{message.content}</a> : message.content}
      </div>
      {message?.attachments.map(a => (
        (a.content_type?.split('/')[0] === 'image' || (a.height && a.width)) ?
          (
            <Card className={classes.root}>
              <CardMedia
                style={{ height: (a.height * 345) / a.width }}
                image={a.proxy_url}
              />
            </Card>
          ) :
          (
            <Card className={classes.root}>
              <CardHeader
                avatar={<DescriptionIcon/>}
                title={a.filename}
                subheader={a.content_type}
                action={
                  <IconButton onClick={() => handleDownload(a.url)}>
                    <GetAppIcon/>
                  </IconButton>
                }
              />
            </Card>
          )
      ))}
    </React.Fragment>
  )
}

export default MessageComp
