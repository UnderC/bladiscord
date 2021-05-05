const makeRegex = (token) => {
  return new RegExp(`(${token})(\\??.*)(${token})`, 'ig')
}

const regexs = {
  'b': makeRegex('\\*\\*'),
  's': makeRegex('~~'),
  'u': makeRegex('__'),
  'i': makeRegex('\\*'),
}

const markdownParse = (data) => {
  let result = data
  for (const tK of Object.keys(regexs)) {
    const reg = regexs[tK]
    const exec = reg.exec(result)
    if (!exec) continue

    const frontend = result.slice(0, exec.index)
    const middleware = `<${tK}>` + exec[2] + `</${tK}>`
    const backend = result.slice(
      exec.index +
      exec[1].length +
      exec[2].length +
      exec[3].length,
      result.length
    )

    if (false) {
      console.log('===========================================')
      console.log(frontend)
      console.log(middleware)
      console.log(backend)
      console.log('===========================================')
    }

    result = frontend + middleware + backend
  }

  return result
}

export default markdownParse
