const initState = null
const types = {
  focusGuild: "FOCUS_GUILD"
}

const focusGuild = (raw) => {
  return {
    type: types.focusGuild,
    raw
  }
}

const setFocusGuild = (state, action) => {
  return {
    ...state,
    focused: action.raw
  }
}

/* const getFocusedGuild = () => {
  return (dispatch, getState) => {
    return dispatch(focusGuild())
  }
} */

const reducer = (state = initState, action) => {
  switch (action.type) {
    case types.focusGuild:
      return setFocusGuild(state, action)
    default:
      return state
  }
}

export { focusGuild as actionCreators }
export default reducer
