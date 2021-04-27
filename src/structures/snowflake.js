function Snowflake (raw) {
  this.raw = raw

  const temp = raw.toString(2)
  // zero fill
  this.formated = Array(64 - temp.length).fill('0').concat(temp).join('')

  this.timestamp = this.formated >>> 22
}

export default Snowflake

'0000001001110001000001100101101011000001000000100000000000000111'
