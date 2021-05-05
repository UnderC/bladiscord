import React from 'react'
// import MDRenderer from 'react-markdown'

import {
  IconButton,
  Card,
  CardHeader,
  CardMedia
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GetAppIcon from '@material-ui/icons/GetApp'
import DescriptionIcon from '@material-ui/icons/Description';
import markdownParse from '../../../structures/markdown'

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
  const { content, attachments } = props

  return (
    <React.Fragment>
      <div style={{ wordBreak: 'break-all' }}>
        <p dangerouslySetInnerHTML={{ __html: markdownParse(content) }}/>
      </div>
      {attachments?.map(a => (
        <React.Fragment key={`m${a.id}`}>
        {(a.content_type?.split('/')[0] === 'image' || (a.height && a.width)) ?
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
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

export default React.memo(MessageComp)
