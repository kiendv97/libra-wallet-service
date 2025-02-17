
module.exports = {
    createWallet: require('./libra.service').createWallet,
    queryBalance: require('./libra.service').queryBalance,
    transfer: require('./libra.service').transfer,
    mint: require('./libra.service').mint,
    queryTransactionHistory: require('./libra.service').queryTransactionHistory,
    // auth
    signin: require('./user.service').signin,
    signup: require('./user.service').signup
}