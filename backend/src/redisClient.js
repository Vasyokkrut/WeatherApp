const redis = require('redis')

const REDISHOST = process.env.REDISHOST || '127.0.0.1'
const REDISPORT = process.env.REDISPORT || '6379'

const client = redis.createClient({
  host: REDISHOST,
  port: REDISPORT
})

module.exports = client
