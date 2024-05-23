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


//RUTAS PARA EL INGRESO
router.get('/crear', (req,res)=>{
    res.render('users/crear',{title:"crear usuario"})
})

router.get('/register', (req,res)=>{
    res.render('users/register',{title:"registrar usuario"})
})

router.get('/login', (req,res)=>{
    res.render('users/login',{title:"Iniciar Sesion"})
})

router.get('/editar/:id', async(req,res)=>{
  const user = await userModel.findById(req.params.id).lean().exec()
  res.render('users/editar',{title:"editar usuario", user })
})


//GRABAR PARA PANTALLA
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

router.post('/editar/:id', async (req, res) => {

        let { id } = req.params    
        let userToReplace = req.body

        if (!userToReplace.password) {
            return res.render('users/editar',{title:"editar usuario", message: "No se puede grabar sin password" })
        }
        let result = await userModel.updateOne({ _id: id }, userToReplace)
        return res.render('users/listado',{title:"Iniciar Sesion",userToReplace, message: "Usuario Actualizado", result})
})


// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const login = req.body;

    try {
      const validar = await userModel.findOne({ email: login.email , password: login.password });

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