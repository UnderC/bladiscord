const getMember = (guild, id) => {
  const result = guild.members.find(m => m.user.id === id)
  return result
}

export default getMember
