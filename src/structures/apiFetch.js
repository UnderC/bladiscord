import apiURL from "../api/const"

const apiFetch = (method, url, token, opts, headers) => {
 return (document.fetch || window.fetch || fetch)(`${apiURL}/${url}`, {
  method,
  headers: {
    'Authorization': `${token}`,
    ...headers
  }, ...opts
 })
}

export default apiFetch
