const {Client}=require('pg')

const client=new Client({
    host:'localhost',
    user:'yash',
    port:5432,
    password:'password',
    database:'postgres'
})

client.connect()

client.on('connect',()=>{
    console.log('Database connected')
})

module.exports=client
