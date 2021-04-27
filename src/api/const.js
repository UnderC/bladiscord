const apiURL = 'https://discord.com/api'
const apiVersion = 8

const gatewayURL = `wss://gateway.discord.gg/?v=${apiVersion}&encoding=json`

export { apiVersion, gatewayURL }
export default `${apiURL}/v${apiVersion}`
