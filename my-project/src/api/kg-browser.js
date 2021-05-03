import neo4jData from './neo4jData.json'

export async function getData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(neo4jData)
    }, 1000)
  })
}
