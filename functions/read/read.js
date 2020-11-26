const faunadb = require("faunadb")
q = faunadb.query
require("dotenv").config()

exports.handler = async (event,context) => {
    try {
      
        var client = new faunadb.Client({ secret: process.env.Faunadb_secret })
        
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('crud-index'))),
            q.Lambda(x => q.Get(x))
          )
      
        )
        console.log(result)
       
        return {
          statusCode: 200,
          body: JSON.stringify(result),
        }
      } catch (error) {
        console.log(error)
        return { statusCode: 500, body: error.toString() }
      }
    }