const type = 'SET_WS'
const initState = {}

const gatewayWS = (raw) => {
  return {
    type,
    raw
  }
}

const getWS = (state, action) => {
  return {
    ...state,
    ws: action.raw
  }
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case type:
      return getWS(state, action)
    default:
      return state
  }
}

export { gatewayWS as actionCreators }
export default reducer
