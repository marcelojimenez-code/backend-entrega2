import { Router } from "express";
import userModel from "../models/user.model.js";
import cartModel from "../models/carts.model.js";

const router = Router();

// router.get('/', async (req, res) => {
//     try {
//         let users = await userModel.find()
//         res.send({ result: "success", payload: users })
//     } catch (error) {
//         console.log(error)
//     }
// })

// router.get('/:uid', async (req, res) => {
//     let { uid } = req.params
//     let result = await userModel.findOne({ _id: uid })
//     res.send({ result: "success", payload: result })
// })

// router.post('/', async (req, res) => {
//     let { nombre, apellido, email } = req.body
//     if (!nombre || !apellido || !email || !usuario || !password) {
//         res.send({ status: "error", error: "Faltan parametros" })
//     }
//     let result = await userModel.create({ nombre, apellido, email, usuario, password })
//     res.send({ result: "success", payload: result })
// })

// router.put('/:uid', async (req, res) => {
//     let { uid } = req.params

//     let userToReplace = req.body

//     if (!userToReplace.nombre || !userToReplace.apellido || !userToReplace.email || !userToReplace.usuario || !userToReplace.password) {
//         res.send({ status: "error", error: "Parametros no definidos" })
//     }
//     let result = await userModel.updateOne({ _id: uid }, userToReplace)

//     res.send({ result: "success", payload: result })
// })

// router.delete('/:uid', async (req, res) => {
//     let { uid } = req.params
//     let result = await userModel.deleteOne({ _id: uid })
//     res.send({ result: "success", payload: result })
// })

router.get('/crear', (req,res)=>{
    res.render('users/crear',{title:"crear usuario"})
})

router.get('/register', (req,res)=>{
    res.render('users/register',{title:"registrar usuario"})
})

router.get('/login', (req,res)=>{
    res.render('users/login',{title:"Iniciar Sesion"})
})

router.post('/register', async(req,res)=>{
   const usuario = req.body
   const findUser = await userModel.findOne({email:usuario.email})

   if(findUser){
      return res.render('users/register',{message:"el usuario ya existe"})
   }

   const cart = await cartModel.create({})
   usuario.cart = cart._id
   const newUser = await userModel.create(usuario)
   return res.render('users/listado',{title:"Iniciar Sesion", newUser, message:"el usuario creado"})

})

router.get('/editar/:uid', async(req,res)=>{
  let { uid } = req.params

  const user = await userModel.findById({uid})
  console.log(user)

  res.render('users/editar',{title:"editar usuario", id: uid, user })
})

router.put('/:uid', async (req, res) => {
        let { uid } = req.params
    
        let userToReplace = req.body
    
        if (!userToReplace.nombre || !userToReplace.apellido || !userToReplace.email || !userToReplace.usuario || !userToReplace.password) {
            res.send({ status: "error", error: "Parametros no definidos" })
        }
        let result = await userModel.updateOne({ _id: uid }, userToReplace)
    
        res.send({ result: "success", payload: result })
    })


// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const login = req.body;

    try {
      const validar = await userModel.findOne({ email: login.email , password: login.password });

      //necesitas que traiga todos los usuario?=

      if (validar) {
        const users = await userModel.find().lean().exec()
        console.log(users)
        return res.render('users/listado',{title:"Iniciar Sesion",users, payload: validar})
      } else {
        return res.render('users/login',{message:"Credenciales inválidas"})
      }
    } catch (error) {
      return res.render('users/login',{message:"Error al intentar iniciar sesión"})
    }

  });    


export default router;