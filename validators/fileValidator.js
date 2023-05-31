import {param, body} from 'express-validator'


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
	productFileValidator
}

