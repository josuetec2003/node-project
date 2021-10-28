import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import con from '../database/connection.js'

var session

export const register = async (req, res) => {
    const { fullname, username, password } = req.body

    // cifrar la contrasena
    const hash = await bcryptjs.hash(password, 8)
    console.log(hash)
    
    // construir la data que será insertada
    const data = {
        username: username,
        password: hash,
        fullname: fullname
    }

    // construir el query con la sintaxis INSERT
    // consultas preparadas
    con.query('INSERT INTO users SET ?', data, (err, result) => {
        if (err) {
            console.log('Ocurrio un error al insertar el registro')
            return
        }

        res.redirect('/')
    })
    
}

export const login = async (req, res) => {
    const { username, password } = req.body
    // const hash = await bcryptjs.hash(password, 8)

    if (!username || !password) {
        res.render('login')
        return;
    }

    // query a la base de datos para verificar que exista el usuario
    con.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        // validar el error

        // evaluaciones cortocircuiteadas
        //console.log(result[0].password)

        // validar si el usuario existe, de existir validar si la contrasena es correcta
        if (result.length === 0 || !(await bcryptjs.compare(password, result[0].password))) {
            res.render('login')
            return
        }

        // crear el token usando el id del usuario
        const id = result[0].id
        const token = jwt.sign({id: id}, process.env.JWT_SECRET)

        // guardar en la sesion el token generado
        session = req.session
        session.token = token

        // el user y password son correctos, podemos continuar
        res.redirect('/')
    })

    
}


// Creando un middleware para proteger las URL que necesitan inicio de sesion
export const isAuthenticated = (req, res, next) => {
    next()
}

// Creando un middleware que monitoree todas las peticiones
export const logger = (req, res, next) => {
    console.log(req.path, req.method)
    console.log('La peticion ha sido interceptada y sigue su rumbo')
    next()
}