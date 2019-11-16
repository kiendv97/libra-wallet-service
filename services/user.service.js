const jwt = require('jsonwebtoken');
const Libra = require('../libra');
const {secretKey} = require('../constant')

const signup = async (req, res, next) => {
    const { password } = req.body
    if (!password) {
        res.status(400).json({
            status: 0,
            message: 'Cần nhập password'
        })
    }
    try {
        const newWallet = await Libra.createWallet()
        const {address = '', mnemonic = ''} = newWallet
        newWallet.password = password
        console.log('[newWallet] ', newWallet);
        const payload  = newWallet
        const token = await jwt.sign(payload, secretKey)
        res.json({
            status: 1,
            message: 'OK',
            data: {
                token: token,
                info: newWallet
            }
        })
    } catch (error) {
        console.log('[error] ', error);
        res.status(500).json({
            status: 0,
            message: error
        })
    }

}

const signin = async (req,res,next) => {
    const { password,token } = req.body
    console.log('[Req.body] ', req.body);
    
    if (!password || !token ) {
        res.status(400).json({
            status: 0,
            message: 'Cần nhập đủ trường'
        })
    }
    try {
        const payload = await jwt.verify(token, secretKey)
        console.log('[payload] ',payload);
        if(!payload) {
            return res.status(403).json({
                status: 0,
                message: 'Nhập sai token'
            })
        }
        // compare password and password payload
        if(password.toString() !== payload.password) {
            return res.status(403).json({
                status: 0,
                message: 'Nhập sai password'
            })
        }
        res.json({
            status: 1,
            message: 'OK',
            data: {
                address: payload.address
            }
        })
    } catch (error) {
        console.log('[Error] ' ,error);
        res.status(500).json({
            status: 0,
            message: error
        })
    }
}

module.exports = {
    signup,
    signin
}