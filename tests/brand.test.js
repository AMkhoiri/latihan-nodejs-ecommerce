import { Op } from 'sequelize'
import fs from 'fs'
import { join } from 'path'
import { Brand } from '../models/index.js'
import request from 'supertest'
import app from "../app.js"

const configData = JSON.parse(fs.readFileSync(join(process.cwd(), 'tests', 'config.json'), 'utf8'))
const authToken = configData["admin_token"]

jest.mock('../models/index.js', () => ({
    __esModule: true,
    Role: {
        ADMIN: 1,
        CUSTOMER: 2,
    },
    Brand: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}))


describe('GET /brands', () => {

    const data = [
        { "id": 1, "name": "Xiaomi", "isActive": true },
        { "id": 2, "name": "Google", "isActive": true },
        { "id": 3, "name": "Samsung", "isActive": true }
    ]

    afterEach(() => {
        Brand.findAll.mockReset()
    })

    it('should return the amount of data as requested', async () => {
        const req = { 
            query: { page : '1', perPage : '2', search : null }
        }

        Brand.findAll.mockResolvedValue(data.slice(0, 2))
        
        const response = await request(app)
            .get(`/brands?page=${req.query.page}&perPage=${req.query.perPage}`)
            .set('Authorization', `Bearer ${authToken}`)

        expect(Brand.findAll).toHaveBeenCalledWith({
            where: {},
            limit:  '2',
            offset: 0
        })
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            code: 200,
            success: true,
            message: "Data Brand berhasil ditampilkan",
            data: data.slice(0, 2)
        })
    })

    it('should return data by search', async () => {
        const req = { 
            query: { page : '1', perPage : '2', search : "Xiao" } 
        }

        Brand.findAll.mockResolvedValue([
            { "id": 1, "name": "Xiaomi", "isActive": true }
        ])

        const response = await request(app)
            .get(`/brands?page=${req.query.page}&perPage=${req.query.perPage}&search=${req.query.search}`)
            .set('Authorization', `Bearer ${authToken}`)
        
        expect(Brand.findAll).toHaveBeenCalledWith({
            where: {
                name: { [Op.iLike]: `%${req.query.search}%` }
            },
            limit:  '2',
            offset: 0
        })
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            code: 200,
            success: true,
            message: "Data Brand berhasil ditampilkan",
            data: [
                { "id": 1, "name": "Xiaomi", "isActive": true }
            ]
        })
    })

    it('should handle error', async () => {
        const req = { 
            query: { page : '1', perPage : '2', search : null } 
        }

        Brand.findAll.mockRejectedValue(new Error('Database error (Unit Testing)'))

        const response = await request(app)
            .get(`/brands?page=${req.query.page}&perPage=${req.query.perPage}`)
            .set('Authorization', `Bearer ${authToken}`)
    
        expect(Brand.findAll).toHaveBeenCalledWith({
            where: {},
            limit:  '2',
            offset: 0
        })
        expect(response.status).toBe(500)
        expect(response.body).toEqual({
            code: 500,
            success: false,
            message: "Terjadi kesalahan koneksi",
        })
    });
})


describe('GET /brands/:id', () => {

    const data = { "id": 1, "name": "Xiaomi", "isActive": true }

    afterEach(() => {
        Brand.findByPk.mockReset()
    })

    it('should return 1 data', async () => {
        const req = { 
            params: { id : '1' } 
        }

        Brand.findByPk.mockResolvedValue(data)

        const response = await request(app)
            .get(`/brands/${req.params.id}`)
            .set('Authorization', `Bearer ${authToken}`)
        
        expect(Brand.findByPk).toHaveBeenCalledWith(req.params.id)
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            code: 200,
            success: true,
            message: "Data Brand berhasil ditampilkan",
            data
        })
    })

    it('should handle if data not found', async () => {
        const req = { 
            params: { id : '1' } 
        }

        Brand.findByPk.mockResolvedValue(null)

        const response = await request(app)
            .get(`/brands/${req.params.id}`)
            .set('Authorization', `Bearer ${authToken}`)
        
        expect(Brand.findByPk).toHaveBeenCalledWith(req.params.id)
        expect(response.status).toBe(400)
        expect(response.body.code).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Pastikan data yang anda kirim sudah benar!')
    })

    it('should handle error', async () => {
        const req = { 
            params: { id : '1' } 
        }

        Brand.findByPk.mockResolvedValueOnce({ "id": 1, "name": "Xiaomi", "isActive": true }) // for bypass validator
        
        Brand.findByPk.mockRejectedValueOnce(new Error('Database error (Unit Testing)'))    // for main logic

        const response = await request(app)
            .get(`/brands/${req.params.id}`)
            .set('Authorization', `Bearer ${authToken}`)
        
        expect(Brand.findByPk).toHaveBeenCalledWith(req.params.id)
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            code: 500,
            success: false,
            message: "Terjadi kesalahan koneksi",
        })
    })
})


describe('POST /brands', () => {

    afterEach(() => {
        Brand.create.mockReset()
    })

    it('should store data', async () => {
        
        const req = { 
            body: { name : 'Xiaomi' }
        }

        const response = await request(app)
            .post(`/brands`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(req.body)

        expect(Brand.create).toHaveBeenCalledWith({
            name: req.body.name,
        }, {
            fields: ['name']
        })
        expect(response.status).toBe(200)
        expect(response.body.code).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe('Data Brand berhasil disimpan')
    })

    it('should handle if data is not valid', async () => {

        const req = { 
            body: { name : '' }
        }

        const response = await request(app)
            .post(`/brands`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(req.body)

        expect(response.status).toBe(400)
        expect(response.body.code).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Pastikan data yang anda kirim sudah benar!')
    })

    it('should handle error', async () => {
        
        const req = { 
            body: { name : 'Xiaomi' }
        }

        Brand.create.mockRejectedValueOnce(new Error('Database error (Unit Testing)'))

        const response = await request(app)
            .post(`/brands`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(req.body)

        expect(Brand.create).toHaveBeenCalledWith({
            name: req.body.name,
        }, {
            fields: ['name']
        })
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            code: 500,
            success: false,
            message: "Terjadi kesalahan koneksi",
        })
    })
})


describe('PUT /brands/:id', () => {

    afterEach(() => {
        Brand.findByPk.mockReset()
        Brand.update.mockReset()
    })

    it('should update data', async () => {
        
        const req = { 
            params: { id: '1' },
            body: { name: 'Poco' }
        }

        Brand.findByPk.mockResolvedValue({ "id": 1, "name": "Xiaomi", "isActive": true })

        const response = await request(app)
            .put(`/brands/${req.params.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(req.body)

        expect(Brand.update).toHaveBeenCalledWith({
            name: req.body.name
        }, {
            where: {
                id: req.params.id
            }
        })
        expect(response.status).toBe(200)
        expect(response.body.code).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe('Data Brand berhasil diubah')
    })

    it('should handle if data not found', async () => {
        
        const req = { 
            params: { id: '1' },
            body: { name: 'Poco' }
        }

        Brand.findByPk.mockResolvedValue(null)

        const response = await request(app)
            .put(`/brands/${req.params.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(req.body)
        
        expect(Brand.findByPk).toHaveBeenCalledWith(req.params.id)
        expect(response.status).toBe(400)
        expect(response.body.code).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Pastikan data yang anda kirim sudah benar!')
    })

    it('should handle if data is not valid', async () => {

        const req = { 
            params: { id: '1' },
            body: { name: '' }
        }

        const response = await request(app)
            .put(`/brands/${req.params.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(req.body)

        expect(response.status).toBe(400)
        expect(response.body.code).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Pastikan data yang anda kirim sudah benar!')
    })

    it('should handle error', async () => {
        
        const req = { 
            params: { id: '1' },
            body: { name: 'Poco' }
        }

        Brand.findByPk.mockResolvedValue({ "id": 1, "name": "Xiaomi", "isActive": true })
        Brand.update.mockRejectedValueOnce(new Error('Database error (Unit Testing)'))

        const response = await request(app)
            .put(`/brands/${req.params.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(req.body)

        expect(Brand.update).toHaveBeenCalledWith({
            name: req.body.name
        }, {
            where: {
                id: req.params.id
            }
        })
        expect(response.status).toBe(500)
        expect(response.body).toEqual({
            code: 500,
            success: false,
            message: "Terjadi kesalahan koneksi",
        })
    })
})


describe('PATCH /brands/:id', () => {

    afterEach(() => {
        Brand.findByPk.mockReset()
        Brand.update.mockReset()
    })

    it('should update data status', async () => {
        
        const req = { 
            params: { id: '1' }
        }

        Brand.findByPk.mockResolvedValue({ "id": 1, "name": "Xiaomi", "isActive": true })

        const response = await request(app)
            .patch(`/brands/${req.params.id}/change-status`)
            .set('Authorization', `Bearer ${authToken}`)
        
        expect(Brand.update).toHaveBeenCalledWith({
            isActive: false,
        }, {
            where: {
                id: req.params.id
            }
        })
        expect(response.status).toBe(200)
        expect(response.body.code).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe('Status Brand berhasil diubah')
    })

    it('should handle if data not found', async () => {
        
        const req = { 
            params: { id: '1' }
        }

        Brand.findByPk.mockResolvedValue(null)

        const response = await request(app)
            .patch(`/brands/${req.params.id}/change-status`)
            .set('Authorization', `Bearer ${authToken}`)
        
        expect(Brand.findByPk).toHaveBeenCalledWith(req.params.id)
        expect(response.status).toBe(400)
        expect(response.body.code).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Pastikan data yang anda kirim sudah benar!')
    })

    it('should handle error', async () => {
        
        const req = { 
            params: { id: '1' }
        }

        Brand.findByPk.mockResolvedValue({ "id": 1, "name": "Xiaomi", "isActive": true })
        Brand.update.mockRejectedValueOnce(new Error('Database error (Unit Testing)'))

        const response = await request(app)
            .patch(`/brands/${req.params.id}/change-status`)
            .set('Authorization', `Bearer ${authToken}`)

        expect(Brand.update).toHaveBeenCalledWith({
            isActive: false,
        }, {
            where: {
                id: req.params.id
            }
        })
        expect(response.status).toBe(500)
        expect(response.body).toEqual({
            code: 500,
            success: false,
            message: "Terjadi kesalahan koneksi",
        })
    })
})