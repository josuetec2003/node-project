import express from 'express'
import { register, login } from '../controllers/authController.js'
const router = express.Router()

// rutas para las vistas
router.get('/', (req, res) => {
    res.render('index')
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/register', (req, res) => {
    res.render('register')
})


// rutas para los controllers
router.post('/register', register)
router.post('/login', login)

export default router