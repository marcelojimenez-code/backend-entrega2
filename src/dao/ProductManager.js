import fs, { readFile, writeFile } from 'fs';


/* Clase de producto */
export class Product {
	
	constructor ( id, title, description, code, price, status, stock, category, thumbnail ){
		this.id = id,
		this.title = title,
		this.description = description,
		this.code = code,
		this.price = price,
		this.status = status,
		this.stock = stock,
		this.category = category,
		this.thumbnail = thumbnail
	}

}

/* Clase de Productos Manager */
export class ProductManager {
	
	constructor () {

		this.path = '../data/productos.json'
	}

	/* Obtener productos de "file" */
	async readProducts () {
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
	async addProduct ( title, description, code, price, status, stock, category, thumbnail ) {

		let messageStatus = 'Producto cargado correctamente.';

		try {
			/* Busco el array de productos */
			const listProduct = await this.readProducts ()

			/* Identifico si existe el producto */
			const findProduct = listProduct.find ( product => product.code === code )

			if (!findProduct) {
				/* Crear ID automatico */
				let autoId = listProduct.length + 1

				/* Verificar que el id no exista */
				const findPid = listProduct.find( product => product.id === autoId )

				/* Condicion por si existe el id autogenerado */
				if (findPid) {
					autoId = autoId + 1;
				}
				
				/* Crear nuevo prodcuto */
				const newProduct = new Product ( autoId, title, description, code, price, status, stock, category, thumbnail )

				/* Agregar producto a array */
				listProduct.push ( newProduct )

				/* Actualizar valores almacenados en file */
				await fs.promises.writeFile ( this.path, JSON.stringify (listProduct) )

			} else {

				messageStatus = `El producto ${findProduct.code} ya existe en la lista`;
				
			}

			return messageStatus;

		} catch (error) {

			console.log(error);

		}

	}

	/* Consultar */
	async getProducts ( limit ) {
		/* Busco el array de productos */
		const products = await this.readProducts ()

		/* Se hace una copia del array de productos */
		const arrayGroup = [...products]

		if (limit) {
			/* Se filtra segun el valor de limit */
			arrayGroup.length = limit;
		}

		return arrayGroup
	}

	/* Consultar por ID */
	async getProductById ( id ) {
		try {
			/* Busco el array de productos */
			const products = await this.readProducts ()

			/* Filtro por el id pasado por parametro */
			const productId = products.find ( product => product.id === id )

			console.log( productId );

			return productId;

		} catch (error) {

			console.log ("No se encontro el producto", error)
		}

	}

	/* Actualizar */
	async updateProduct(id, inputToUpdate) {	

		try {
		  	/* Busco el array de productos */
		  	const products = await this.readProducts();
	
			// Encontrar el índice del producto a actualizar
			const productIndex = products.findIndex((product) => product.id === id);

			if (productIndex !== -1) {
				// Obtener el producto original
				const originalProduct = products[productIndex];

				// Fusionar las propiedades proporcionadas con el producto original
				const updatedProduct = { ...originalProduct, ...inputToUpdate };

				// Actualizar solo las propiedades fusionadas en el producto original
				products[productIndex] = updatedProduct;

				// Guardar los productos actualizados
				await fs.promises.writeFile(this.path, JSON.stringify(products));

				return updatedProduct;

			}
		  
		} catch (error) {

		  console.error("Hubo un error al actualizar el producto");
		  
		}
	}
		
	/* Borrar */
	async deleteProduct ( id ) {

		let message = 'El producto se elimino correctamente.';

		try {
			/* Busco el array de productos */
			const products = await this.readProducts ();

			/* Detecto el index del producto filtrado */
			const indexProduct = products.findIndex ( product => product.id === id );

			if (indexProduct !== -1 ) {

				products.splice ( indexProduct, 1 );

				await fs.promises.writeFile ( this.path, JSON.stringify ( products ) );

			} else {

				message = 'El producto no existe.';
			}

			return message;
			
		} catch (error) {

			message = "Hubo un error al eliminar el producto";

		}
		
	}
}


/*
const productManager = new ProductManager();

productManager.addProduct({
    title: "Producto A",
    description : "descripcion producto A",
    price: 10.99,
    thumbnail : 'ruta/imagenA.jpg',
    code: 'P001',
    stock:5
})

productManager.addProduct({
    title: "Producto B",
    description : "descripcion producto B",
    price: 20.99,
    thumbnail : 'ruta/imagenB.jpg',
    code: 'P002',
    stock:10
})

productManager.addProduct({
    title: "Producto C",
    description : "descripcion producto C",
    price: 25,
    thumbnail : 'ruta/imagenC.jpg',
    code: 'P004',
    stock:10
})

const productos = productManager.getProducts()
const producto = productManager.getProductById(2)
console.log(producto)
*/