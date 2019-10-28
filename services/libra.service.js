const Libra = require('../libra')

const createWallet = async (req,res,next) => {
    try {
        res.status(200).json({
            status: 1,
            message: 'OK',
            data: await Libra.createWallet()
        })
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error,
        })
    }
   
}

const queryBalance = async (req,res,next) => {

    try {
        const address  = req.body.address;

        if(!address) res.status(400).json({status: 0, message: 'Address not found'})
    
        const data = await Libra.queryBalance(address)
    
        res.status(200).json({
            status: 1,
            message: 'OK',
            data: data
        })
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error,
        })
    }
  
}

const mint = async (req,res,next)=> {
    try {
        const address = req.body.address || 'c12f6a22942e093f1eabe0cfc49679a9d1f55445317b5f4e9797df4d066022ee'
        const amount = req.body.amount || 0 

        const data = await Libra.mint(address,amount)

        res.status(200).json({
            status: 1,
            message: 'OK',
            data: data
        })

    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.toString(),
        })
    }
}

const transfer = async (req,res,next) => {
    try {
        const toAddress = req.body.toAddress || 'c12f6a22942e093f1eabe0cfc49679a9d1f55445317b5f4e9797df4d066022ee'
        const amount = req.body.amount || 0
        const mnemonic = req.body.mnemonic || ''
        const fromAddress = req.body.fromAddress || 'c12f6a22942e093f1eabe0cfc49679a9d1f55445317b5f4e9797df4d066022ee' 

        const data = await Libra.transfer(mnemonic, toAddress,amount)

        res.status(200).json({
            status: 1,
            message: 'OK',
            data: data
        })

    } catch (error) {
        console.log('[error] ', error);
        
        res.status(500).json({
            status: 0,
            message: error.toString(),
        })
    }
}
const queryTransactionHistory = async (req,res,next) => {
    try {
        const address = req.body.address || 'c12f6a22942e093f1eabe0cfc49679a9d1f55445317b5f4e9797df4d066022ee'

        const data = await Libra.queryTransactionHistory(address)

        res.status(200).json({
            status: 1,
            message: 'OK',
            data: data
        })

    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error,
        })
    }
}

module.exports = {
    createWallet,
    queryBalance,
    mint,
    transfer,
    queryTransactionHistory
}