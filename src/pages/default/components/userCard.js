import {
  Card,
  CardHeader,
  CardActions,
  Button,
  Avatar
} from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import red from '@material-ui/core/colors/red'
import { ThemeProvider } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core/styles'
const theme = createMuiTheme({
  palette: {
    primary: red
  }
})

const UserCard = (props) => {
  const { handleLogout } = props
  const { user } = props.user

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=128`}
          />
        }
        title={user.username}
        subheader={`#${user.discriminator}`}
      />

      <ThemeProvider theme={theme}>
        <CardActions>
          <Button
            color='primary'
            startIcon={<ExitToAppIcon/>}
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </CardActions>
      </ThemeProvider>
    </Card>
  )
}

export default UserCard
