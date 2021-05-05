import apiFetch from './apiFetch'

const fetchMessages = (token, cID, messages, before) => {
  let query = `limit=50`
  if (before) query += `&before=${before}`

  return apiFetch('GET', `channels/${cID}/messages?${query.toString()}`, token)
    .then(res => res.json())
    .then(r => {
      if (!Array.isArray(r)) throw r
      else return [...r.reverse(), ...messages]
    })
}

const fetchMessage = (token, cID, mID) => {
  return apiFetch('GET', `channels/${cID}/messages?limit=1&around=${mID}`, token)
    .then(res => res.json())
    .then(r => r[0])
}

const sortMessages = (messages) => {
  const result = []

  let bef = null
  const filtered = messages.map(m => {
    let _bef = bef
    bef = m.author.id
    if (_bef !== m.author.id) return m.author
  })

  let startIndex = 0
  for (const m of filtered) {
    if (!m) continue

    const bef = m.id
    let swit = false
    
    const filtered = messages.filter((_m, i) => {
      if (swit || (startIndex > i)) return false
      else if (bef !== _m.author.id) {
        startIndex = i
        swit = true
        return false
      }
      
      return true
    })

    m.messages = filtered
    result.push(m)
  }

  return result
}

export { sortMessages, fetchMessages, fetchMessage }
