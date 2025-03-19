const _ = require('lodash')

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const convertSelectData = (select = []) => {
  return Object.fromEntries(select.map(e => [e, 1]))
}

const convertUnselectData = (select = []) => {
  return Object.fromEntries(select.map(e => [e, 0]))
}

const removeNullFields = obj => {
    Object.keys(obj).forEach( key => {
      if(obj[key] == null){
        delete obj[key]
      }
    })
}

const nestedObjectParser = obj => {
  const final = {}
  Object.keys(obj).forEach(key => {
    if(typeof obj[key] === 'object' && !Array.isArray(obj[key])){
      const res = nestedObjectParser(obj[key])
      Object.keys(res).forEach(a=>{
        final[`${k}.${a}`] = res[a]
      })
    }else{
      final[key] = obj[key]
    }
  })

  return final
}

module.exports = {
  getInfoData,
  convertSelectData,
  convertUnselectData,
  removeNullFields,
  nestedObjectParser
}