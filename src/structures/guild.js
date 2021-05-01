const getGuildRoles = (member, guild) => {
  const result = guild.roles.filter(r => member.roles.includes(r.id))
  return [guild.roles[0], ...result]
}

const getGuildMember = (guild, id) => {
  const result = guild.members.find(m => m.user.id === id)
  return result
}

export { getGuildMember, getGuildRoles }