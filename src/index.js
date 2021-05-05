import 'core-js/es/map'
import 'core-js/es/set'
import 'core-js/features/array/find'
import 'core-js/features/array/includes'
import 'core-js/features/number/is-nan'
import 'core-js/es/promise'
import 'whatwg-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import Root from './pages/Router'
import reportWebVitals from './reportWebVitals'
import { Provider } from "react-redux"
import store from './redux/configureStore'

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
