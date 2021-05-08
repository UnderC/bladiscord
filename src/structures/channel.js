const makeWithCategory = (channels) => {
  const categories = [{ dummy: true, type: 4, id: null }]
    .concat(channels.filter(c => c.type === 4))

  for (let c of categories) {
    c.children = channels
      .filter(_c => _c.type !== 4 && (_c.parent_id || null) === c.id)
      .sort((l, r) => l.position - r.position)
      .sort((l, r) => l.type - r.type)
  }

  return categories
}

const mergePerm = (roles) => {
  return roles.map(r => r.permissions)
}

const privateChannel = (g) => {
  const name = g.type === 1 ?
    g.recipients[0].username :
    g.name || `${g.recipients.length}명의 그룹`

  const avatar = g.type === 3 ?
    `https://cdn.discordapp.com/channel-icons/${g.id}/${g.icon}.png?` :
    `https://cdn.discordapp.com/avatars/${g.recipients[0].id}/${g.recipients[0].avatar}.webp?size=128`

  return {
    name,
    avatar,
    ...g
  }
}

const channelPermFilter = (roles, channels, category) => {
  const permissions = mergePerm(roles)
  const roleIDs = roles.map(r => r.id)
  const filter = (c) => {
    if (c.type === 2) return false
    const f = permissions.find(p => (p & 8) === 8)
    if (!isNaN(f)) return true
    
    let result = 104324673
    const owFilter = c.permission_overwrites.filter(ow => roleIDs.includes(ow.id))

    if (category.permission_overwrites) {
      const _owFilter = category.permission_overwrites.filter(ow => roleIDs.includes(ow.id))
      for (let ow of _owFilter) {
        result &= ~Number(ow.deny)
        result |= Number(ow.allow)
      }
    }

    for (let ow of owFilter) {
      result &= ~Number(ow.deny)
      result |= Number(ow.allow)
    }

    return ((result & 1024) === 1024)
  }

  const result = channels.filter(filter)
  return result
}

export { makeWithCategory, channelPermFilter, privateChannel }
