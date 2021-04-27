const type = 'GET_PASSWD'
const initState = null

const passwd = (raw) => {
  return {
    type,
    raw
  }
}

const setPasswd = (state, action) => {
  return {
    ...state,
    passwd: action.raw
  }
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case type:
      return setPasswd(state, action)
    default:
      return state
  }
}

export { passwd as actionCreators }
export default reducer
