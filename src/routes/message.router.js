import { Router } from "express";
import messageModel from "../models/message.model.js";

const router = Router();
/*
router.get('/', async (req, res) => {
    try {
        let messages = await messageModel.find()
        res.send({ result: "success", payload: messages })
    } catch (error) {
        console.log(error)
    }
})

router.get('/:uid', async (req, res) => {
    let { uid } = req.params
    let result = await messageModel.findOne({ _id: uid })
    res.send({ result: "success", payload: result })
})

router.post('/', async (req, res) => {
    let { user, message } = req.body
    if (!user || !message) {
        res.send({ status: "error", error: "Faltan parametros" })
    }
    let result = await messageModel.create({  user, message })
    res.send({ result: "success", payload: result })
})

router.put('/:uid', async (req, res) => {
    let { uid } = req.params

    let messageToReplace = req.body

    if (!messageToReplace.nombre || !messageToReplace.apellido || !messageToReplace.email) {
        res.send({ status: "error", error: "Parametros no definidos" })
    }
    let result = await messageModel.updateOne({ _id: uid }, messageToReplace)

    res.send({ result: "success", payload: result })
})

router.delete('/:uid', async (req, res) => {
    let { uid } = req.params
    let result = await messageModel.deleteOne({ _id: uid })
    res.send({ result: "success", payload: result })
})
*/

router.get('/chat', (req,res)=>{
    res.render('chat/chat',{title:"Chat usuario"})
})


export default router;