import {param, body} from 'express-validator'
import {Role, Category, Brand, Product, ProductImage} from '../models/index.js'


/*params validator*/

const checkProductIdValidator = [
	param('id')
		.notEmpty().withMessage('Parameter ID Product wajib diisi').bail()
		.isInt().withMessage('Parameter ID Product harus berupa angka').bail()
		.custom(async(value) => {
			const product = await Product.findByPk(value)
			if (!product) throw new Error('Data Product tidak ditemukan')
			return true
		})
]

const checkProductImageIdValidator = [
	param('fileId')
		.notEmpty().withMessage('Parameter ID File wajib diisi').bail()
		.isInt().withMessage('Parameter ID FIle harus berupa angka').bail()
		.custom(async(value) => {
			const productImage = await ProductImage.findByPk(value)
			if (!productImage) throw new Error('Data File tidak ditemukan')
			return true
		})
]

/*body validator*/

const createProductValidator = [
	body('categoryId')
		.notEmpty().withMessage('Kategori Product wajib diisi')
		.isInt().withMessage('Kategori harus berupa angka').bail()
		.custom(async(value) => {
			const category = await Category.findByPk(value)
			if (!category) throw new Error('Data Kategori tidak ditemukan')
			return true
		}),
	body('brandId')
		.notEmpty().withMessage('Brand Product wajib diisi')
		.isInt().withMessage('Brand harus berupa angka').bail()
		.custom(async(value) => {
			const brand = await Brand.findByPk(value)
			if (!brand) throw new Error('Data Brand tidak ditemukan')
			return true
		}),
	body('name')
		.notEmpty().withMessage('Nama Product wajib diisi'),
	body('description')
		.notEmpty().withMessage('Deskripsi Product wajib diisi'),
	body('stock')
		.notEmpty().withMessage('Stok awal Product wajib diisi')
		.isInt({ min: 0 }).withMessage('Stok harus berupa angka'),
	body('price')
		.notEmpty().withMessage('Harga Product wajib diisi')
		.isNumeric().withMessage('Harga harus berupa angka')
    	.isFloat({ min: 0 }).withMessage('Harga harus lebih besar dari 0')
]

const updateProductValidator = [
	body('name')
		.notEmpty().withMessage('Nama Product wajib diisi'),
	body('description')
		.notEmpty().withMessage('Deskripsi Product wajib diisi')
]

const stockAdjustmentProductValidator = [
	body('operationType')
		.notEmpty().withMessage('Tipe Adjustment wajib diisi').bail()
		.custom((value) => {
			let allowedValues = [Product.STOCK_INCREASE, Product.STOCK_DECREASE]
			if (!allowedValues.includes(value)) throw new Error('Tipe Adjustment salah')
			return true
		}),
	body('stock')
		.notEmpty().withMessage('Stok adjusment Product wajib diisi')
		.isInt({ min: 0 }).withMessage('Stok harus berupa angka')
]

const priceAdjustmentProductValidator = [
	body('newPrice')
		.notEmpty().withMessage('Harga Product wajib diisi')
		.isNumeric().withMessage('Harga harus berupa angka').bail()
    	.isFloat({ min: 0 }).withMessage('Harga harus lebih besar dari 0').bail()
    	.custom(async(value, { req }) => {
    		const productToUpdate = await Product.findByPk(req.params.id)
    		if (parseFloat(value) == parseFloat(productToUpdate.price)) throw new Error(`Harga harus berbeda dari yang sekarang: ${productToUpdate.price}`)
    			return true
    	})
]

/*file validator*/

const productFileValidator = [
	body('files')
		.isArray().withMessage('Data harus berupa array').bail()
		/*required*/
		.custom((value, { req }) => {
			if (!req.files || req.files.length === 0) throw new Error('File harus diunggah')
			return true
		}).bail()
		/*allowed extensions*/
		.custom((value, { req }) => {
			const allowedExtensions = ['.jpg', '.jpeg']
			const files = req.files
			const invalidFiles = files.filter((file) => {
				const fileExt = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase()
				return !allowedExtensions.includes(fileExt)
			})
			if (invalidFiles.length > 0) throw new Error(`Ekstensi file tidak valid: ${invalidFiles.map((file) => file.originalname).join(', ')}`)
			return true
		})
		/*allowed mimetypes*/
		.custom((value, { req }) => {
			const allowedMimeTypes = ['image/jpeg']
		    const files = req.files
		    const invalidFiles = files.filter((file) => !allowedMimeTypes.includes(file.mimetype))
		    if (invalidFiles.length > 0) throw new Error(`Tipe file tidak valid: ${invalidFiles.map((file) => file.originalname).join(', ')}`)
		    return true
		})
		/*max size*/
		.custom((value, { req }) => {
	      	const maxSizeInBytes = 5 * 1024 * 1024; // max 5MB
	      	const files = req.files
	      	const invalidFiles = files.filter((file) => file.size > maxSizeInBytes);
	      	if (invalidFiles.length > 0) throw new Error(`Ukuran file terlalu besar (max: 5MB): ${invalidFiles.map((file) => file.originalname).join(', ')}`)
	      	return true
	    })
]


export {
	checkProductIdValidator,
	checkProductImageIdValidator,
	createProductValidator,
	updateProductValidator,
	stockAdjustmentProductValidator,
	priceAdjustmentProductValidator,
	productFileValidator
}
