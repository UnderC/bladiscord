const initState = null
const types = {
  focusChannel: "FOCUS_CHANNEL"
}

const focusChannel = (raw) => {
  return {
    type: types.focusChannel,
    raw
  }
}

const setFocusChannel = (state, action) => {
  return {
    ...state,
    focusedChannel: action.raw
  }
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case types.focusChannel:
      return setFocusChannel(state, action)
    default:
      return state
  }
}

export { focusChannel as actionCreators }
export default reducer
