const apiURL = 'https://discord.com/api'
const apiVersion = 9

const gatewayURL = `wss://gateway.discord.gg/?v=${apiVersion}&encoding=json`

export { apiVersion, gatewayURL }
export default `${apiURL}/v${apiVersion}`
