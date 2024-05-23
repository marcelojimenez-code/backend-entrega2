import express from 'express'
import mongoose from 'mongoose'

import { __dirname } from './utils.js';
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'

import userRouter from './routes/users.router.js'
import productRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import messageRouter from './routes/message.router.js'

import { Server } from 'socket.io'
import dotenv from 'dotenv'
import messagesModel from './models/message.model.js'

dotenv.config()
console.log(process.env.MONGO_URL)

/* Nombramos la variable app con la función de express */
const app = express();

/* Definimos el puerto */
const PORT = 8080 || 3000;
const httpServer = app.listen(PORT, console.log(`Server running on port ${PORT}`))

/* Definimos los middlewares */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/*inicializamos el motor indicando con app engine */
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars')
/* definimos el archivo estatico */
app.use(express.static('./src/public'))

//app.use(express.static(__dirname + '/public'))
app.use('/', viewsRouter)
app.use('/users', userRouter)
app.use('/chat', messageRouter)
app.use('/products', productRouter)

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/messages', messageRouter)

const socketServer = new Server(httpServer)

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexion", error))
    
socketServer.on('connection', socket => {
    socket.on('message', async data => {
        await messagesModel.create(data)
        let messages = await messagesModel.find().lean().exec()
        console.log(`mensaje recibido ${data}`)
        socketServer.emit('logs', messages)
    })
})




/* Escuchar los cambios del servidor */
/*
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
*/