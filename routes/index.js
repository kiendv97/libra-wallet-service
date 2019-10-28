var express = require('express');
var router = express.Router();
//
const services = require('../services');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/login');
router.post('/logout');
router.post('/registry');
router.post('/transaction', services.Transaction);
router.post('/transaction/v2', services.TransactionV2);
router.post('/minting',services.MintingCoin);
router.get('/account', services.GetAllAccount);
router.get('/account/:address',services.Account);
module.exports = router;
