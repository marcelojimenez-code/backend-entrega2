import { Router } from "express";
import cartModel from "../models/carts.model.js";

const router = Router()

router.get('/', async (req, res) => {

    try {
        const carts = await cartModel.find().lean().exec()


        res.status(200).json({
            status:true,
            message:'Lista de carritos',
            data: carts
        })

    } catch (error) {
        res.status(500).json( [ { message: 'Hubo un error al obtener los carritos' } ] );
    }
})

/* POST / */
//Crea un nuevo carro
router.post('/', async ( req, res ) => {
 
    try {
        const newCartAdded = await newInstanceCart.addCart();
        res.status(200).json([{ message: 'Carrito agregado' }, {newCartAdded}]);
    } catch (error) {
        res.status(500).json([{ message: error }]);
    }
    
        
})

/* GET /:cid */
router.get('/:cid', async ( req, res ) => {

    const {cid} = req.params

    try{
        const cart = await cartModel.findOne({_id:cid})
        res.status(200).json({
            status:true,
            message:`Carrito id:${cid}`,
            data:cart
        })

    }catch(error){
        res.status(200).json({
            status:false,
            message:"Ocurrio un error",
            error:error
        })
    }        
})

/* POST  /:cid/product/:pid */
//ESTA NO ES POST SI RECIBES PARAMETROS jaja
//Esta ruta despues la tienes que modificar, porque se uspoen con jwt tendras al usuario que ya tiene un carrito,
//Entonces llamas ese carrito y lo recibes y solo envias un post con el _id del producto

router.get('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const quantity = 1;

    try {

        const getCart = await cartModel.findOne({ _id: cid });

        const findProductInCart = getCart.products.find(product => product._id.toString() === pid);

        if (findProductInCart) {
            findProductInCart.quantity += quantity;
        } else {

            getCart.products.push({_id:pid,quantity:quantity});
        }

        await getCart.save();

        res.status(200).json({
            cart: getCart
        });
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});






// router.post('/:cid/product/:pid', async (req, res) => {
    
//     /* Se obtinen los valores de params */
//     const cid = parseInt(req.params.cid);
//     const pid = parseInt(req.params.pid);

//     try {

//         /* Se llama al metodo para añadir productos a un carrito exitente o nuevo carrito */
//         const currentCart = await newInstanceCart.addProductToCart(cid, pid)
//         res.status(200).json([{ message: 'Se añadio correctamente el producto al carrito' }, {currentCart}]);

//     } catch (error) {
        
//         res.status(500).json([{ message: error }]);
//     }
// });



export default router;