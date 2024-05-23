import { Router } from "express";
import  productsModel from '../models/products.model.js'

const router = Router()




router.get('/', async (req, res) => {
    
    const limit = req.query?.limit || 8
    const page = req.query?.page || 1
    const filter = req.query?.filter || ''
    const sortQuery = req.query?.sort || ''
    const sortQueryOrder = req.query?.sortorder || 'desc'

    const search = {}
    if(filter){
        search.title = filter
    }
    const sort = {}
    if(sortQuery){
        sort[sortQuery]= sortQueryOrder
    }
    const options = {
        limit,
        page,
        sort,
        lean:true
    }
    const data = await productsModel.paginate(search,options)
    console.log(JSON.stringify(data,null,2,'\t'))
    const front_pagination = []
    for (let index = 1; index <= data.totalPages; index++) {
        front_pagination.push({
            page:index,
            active: index == data.page
        })
    }
    res.render('products/index',{data,front_pagination})
})


// router.get('/products', async (req, res) => {
//     let { limit = 10, page = 1, sort, query} = req.query
//     limit = parseInt(limit)
//     page  = parseInt(page)
//     try {

//         let filter = {}

//         if (query){
//             filter = {
//                 $or: [{category: query},
//                     {available: query.toLocaleLowerCase() === 'true'}
//                 ]
//             }
//         }

//         //opciones de sorteo
//         let sortOptions = {}

//         if (sort){
//             sortOptions.price = sort === 'asc' ? 1 : -1
//         }

//         // obtener el total de productos que coinciden con el filtro
//         const totalProducts = await productsModel.countDocuments(filter)

//         //calcular la paginacion
//         const totalPages = Math.ceil(totalProducts / limit)
//         const offset = (page - 1) * limit

//         const products = await productsModel.find(filter)
//                                             .sort(sortOptions)
//                                             .skip(offset)
//                                             .limit(limit)

//         const response = {
//             status: "success",
//             payload: products,
//             totalPages,
//             prevPage: page > 1 ? 1 : null,
//             nextPage: page < totalPages ? page + 1 : null,
//             page,
//             hasPrevpage: page > 1,
//             hasNextPage: page > totalPages,
//             prevLink: page > 1 ? `/products?limit=${limit}&page=${page-1}&sort=${sort || ''}&query=${query || ''}` : null,
//             nextLink: page > totalPages ? `/products?limit=${limit}&page=${page+1}&sort=${sort || ''}&query=${query || ''}` : null
//         }

//         res.json(response)

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({status: "error", message: "Internal Server Error"})
//     }
// })



router.put('/:uid', async (req, res) => {
    let { uid } = req.params

    let userToReplace = req.body

    if (!userToReplace.nombre || !userToReplace.apellido || !userToReplace.email) {
        res.send({ status: "error", error: "Parametros no definidos" })
    }
    let result = await productsModel.updateOne({ _id: uid }, userToReplace)

    res.send({ result: "success", payload: result })
})

router.delete('/:uid', async (req, res) => {
    let { uid } = req.params
    let result = await productsModel.deleteOne({ _id: uid })
    res.send({ result: "success", payload: result })
})

router.get('/index', (req,res)=>{
    res.render('products/index',{title:"listado de productos"})
})

router.get('/crear', (req,res)=>{
    res.render('products/crear',{title:"crear productos"})
})

router.get('/editar', (req,res)=>{
    res.render('products/editar',{title:"editar productos"})
})

router.get('/eliminar', (req,res)=>{
    res.render('products/eliminar',{title:"eliminar productos"})
})

router.post('/', async (req, res) => {
    try {
        let products = req.body 
        console.log("llega")
        console.log(products)
        const product = await productsModel.create(req.body)
        return res.render('products/crear',{title:"crear productos", message:'Producto creado correctamente'})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: "error", message: "Internal Server Error"})
    }
    
})

export default router;