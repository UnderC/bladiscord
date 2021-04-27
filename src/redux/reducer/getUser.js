const initState = {}
const types = {
  getUser: "GET_USER"
}

const getUser = (raw) => {
  return {
    type: types.getUser,
    raw
  }
}

const setUser = (state, action) => {
  return {
    ...state,
    user: action.raw
  }
}

const reducer = (state = initState, action) => {
  console.log(action)
  switch (action.type) {
    case types.getUser:
      return setUser(state, action)
    default:
      return state
  }
}

export { getUser as actionCreators }
export default reducer
