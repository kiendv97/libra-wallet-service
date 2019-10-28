var express = require('express');
var router = express.Router();
//
const { createWallet, queryBalance,mint,transfer,queryTransactionHistory } = require('../services');
/* GET home page. */
router.get('/test', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/createWallet', createWallet)
router.get('/getBalance', queryBalance)
router.post('/mint', mint )
router.get('/queryTransactionHistory', queryTransactionHistory )
router.post('/transfer', transfer )

module.exports = router;

