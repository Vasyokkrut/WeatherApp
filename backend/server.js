const app = require('./src/app.js')
const client = require('./src/redisClient.js')

const SERVERPORT = process.env.SERVERPORT || 5000

client.on('error', () => {
  throw new Error('cannot connect to redis')
})

client.on('connect', () => {
  console.log('redis connected')
  app.listen(SERVERPORT, () => console.log('server started successfully'))
})
