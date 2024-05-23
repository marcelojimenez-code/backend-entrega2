import { Router } from "express";
import cartModel from "../models/carts.model.js";

const router = Router()

router.get('/', async (req, res) => {

    try {

        const carts = await newInstanceCart.readCarts()
        res.status(200).json( [ { carts } ] );

    } catch (error) {

        res.status(500).json( [ { message: 'Hubo un error al obtener los carritos' } ] );

    }
})

/* POST / */
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

    const cid = parseInt( req.params.cid );
 
    try {
        const listOfProductsFromCart = await newInstanceCart.getProductsFromCart(cid);
        res.status(200).json([{ listOfProductsFromCart }]);
    } catch (error) {
        res.status(500).json([{ message: error }]);
    }
    
        
})

/* POST  /:cid/product/:pid */
router.post('/:cid/product/:pid', async (req, res) => {
    
    /* Se obtinen los valores de params */
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    try {

        /* Se llama al metodo para añadir productos a un carrito exitente o nuevo carrito */
        const currentCart = await newInstanceCart.addProductToCart(cid, pid)
        res.status(200).json([{ message: 'Se añadio correctamente el producto al carrito' }, {currentCart}]);

    } catch (error) {
        
        res.status(500).json([{ message: error }]);
    }
});



export default router;