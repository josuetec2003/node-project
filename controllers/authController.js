import bcryptjs from 'bcryptjs'
import con from '../database/connection.js'

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

export const login = (req, res) => {
    const { username, password } = req.body

    console.log(username, password)
}