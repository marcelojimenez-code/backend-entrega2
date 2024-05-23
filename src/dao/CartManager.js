import fs, { readFileSync, writeFileSync } from 'fs';

/* Clase de producto */
export class Cart {
	
	constructor ( id, products ){
		this.id = id,
		this.products = products
	}

}

/* Clase de Productos Manager */
export class CartManager {
	
	constructor () {

		this.path = '../data/carts.json'
	}

	/* Obtener carritos */
	async readCarts () {
		try {
			/* Obtengo el contenido de "file" */
			const data = await fs.promises.readFile(this.path, "utf8")

			/* Convierto el contenido a formato de array de objetos*/
			return JSON.parse(data)
		} catch (error) {
			console.error('Hubo un error al intentar leer la lista de producto:', error)
		}
	}

	/* Agregar */
	async addCart () {

		try {
			/* Busco el array de productos */
			const listCarts = await this.readCarts ();

			/* Crear ID automatico */
			let autoId = listCarts.length + 1;

			/* Verificar que el id no exista */
			const findCid = listCarts.find( cart => cart.id === autoId );

			/* Condicion por si existe el id autogenerado */
			if (findCid) {
				autoId = autoId + 1;
			}
			
			/* Crear nuevo Carrito */
			const newCart = new Cart ( autoId, [] );

			/* Agregar producto a array */
			listCarts.push ( newCart );

			/* Actualizar valores almacenados en file */
			await fs.promises.writeFile ( this.path, JSON.stringify (listCarts) );

			return newCart;


		} catch (error) {

			console.log(error);

		}

	}

	/* Consultar productos del carrito*/
	async getProductsFromCart ( id ) {

		/* Busco el array de carritos */
		const listCarts = await this.readCarts ();

		try {
			/* Identifico el carrito */
			const cart = listCarts.find ( cart => cart.id === id );
			
			return cart.products;

		} catch (error) {

			console.log('Hubo un error a obtener los productos del carrito', error);

		}
	}

	/* Añadir producto al carrito */
	async addProductToCart ( cid, pid ) {

		/* Busco el array de carritos */
		const listCarts = await this.readCarts ();

		/* Identifico el carrito */
		const cart = listCarts.find ( cart => cart.id === cid );

		try {
			
			/* Se valida si el carrito existe */
			if (cart) {
				
				/* Se busca el id del producto en el array de productos del carrito  */
				const product = cart.products.find( item => item.product === pid);

				/* Si el producto existe se actualiza la cantidad, si no existe se crea un nuevo producto */
				if (product) {

					/* Sumar solo la cantidad */
					product.quantity ++;

				} else {

					/* Crear nuevo producto */
					const newProductToCart = {
					"product": pid,
					"quantity": 1,
					};

					/* Agregar nuevo producto al carrito */
					cart.products.push(newProductToCart);
				}

				/* Añadir producto a carrito */
				await fs.promises.writeFile(this.path, JSON.stringify(listCarts));

			} else {

				/* Si el carrito no existe */
				console.log('El carrito no existe, pero se creo uno nuevo');

				/* Se crea un nuevo carrito con el id pasado */
				await this.addCart (cid);

				/* Se agrega el producto al carrito creado */
				await this.addProductToCart ( cid, pid);

			}	

			return cart; 


		} catch (error) {

			console.log('Hubo un error al agregar el producto al carrito', error);

		}
	}

}

