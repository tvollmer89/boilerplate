import MiniSearch from 'minisearch'
const stopWords = new Set(['and', 'or', 'to', 'in', 'a', 'the'])
const defaultTokenize = MiniSearch.getDefault('tokenize');
let miniSearch = new MiniSearch({
  fields: ['title', 'id', 'type', 'categories', 'description', 'pubDate'],
  storeFields: ['title', 'id', 'type', 'categories'], 
  searchOptions: {
    boost: {title: 2},
    fuzzy: 0.2
  },
  extractField: (doc, fieldName) => {
    return doc[fieldName]
  },
  tokenize: (text, _fieldName) => {
    if(_fieldName == "categories") {
      return text.split(',');
    }
    return defaultTokenize(text, _fieldName)
  }
})

function initSearch(list) {
  miniSearch.addAll(list)
  // let results = miniSearch.search({
  //   queries:['article'],
  //   fields: ['type'],
  //   fuzzy: false,
  //   tokenize: (string, _fieldName) => string.split(',')
  // })
  // let results = miniSearch.search({queries: ["pro"], fuzzy: true})
  
  // console.log(`results: ${JSON.stringify(results.map(r => r.id))}`)
  // console.log(`result count: ${results.length}`)
}


/**
 * 
 * @param {string} text Text Search String
 * @param {string} type (optional) Current tab (i.e. articles, podcast, etc.) 
 * @param {array} categories (optional) Array of any category checkboxes selected
 * @returns an array of Id's identifying matching items
 */
const runSearch = (text, type, c = []) => {
  console.log(`filter called: ${text}, ${typeof type}, ${c}`)
  let q = text == "" ? [] : [text];
  let t = type.split("|")
  if(type != "all") {
    q.push({
      queries: t, 
      fields:['type'],
      fuzzy: false
    })
  }
  if (c.length > 0) {
    q.push({
      queries: c,
      fields: ['categories'],
      fuzzy: false,
      tokenize: (string, _fieldName) => string.split(',')
    })
  }
  console.log(`q: ${JSON.stringify(q)}`)
  let results = miniSearch.search({
    combineWith: 'AND',
    queries: q
  }, {    filter: (result) => {
    console.log(`type: ${type}`)
    let t = result.type.split("|")
    return result.type.includes(type)
  }})
  // console.log(`results: ${JSON.stringify(results)}`)
  return results.map(r => r.id)
}

export { initSearch, runSearch }