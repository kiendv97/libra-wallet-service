const { LibraClient, LibraNetwork, Account, LibraWallet, LibraAdmissionControlStatus } = require('kulap-libra')
const axios = require('axios')
const moment = require('moment')
const BigNumber = require('bignumber.js')

const queryBalance = async function (address) {

  const client = new LibraClient({ network: LibraNetwork.Testnet })
  const accountState = await client.getAccountState(address)
  const balanceInMicroLibras = BigNumber(accountState.balance.toString(10))
  const balace = balanceInMicroLibras.dividedBy(BigNumber(1e6))
  return balace.toString(10)

}

const createWallet = function () {
  const client = new LibraClient({ network: LibraNetwork.Testnet })

  const wallet = new LibraWallet()

  const account = wallet.newAccount()

  return {
    address: account.getAddress().toHex(),
    mnemonic: wallet.config.mnemonic
  }
}


const mint = async function (address, amount) {
  const client = new LibraClient({ network: LibraNetwork.Testnet })

  // Mint 100 Libra coins
  const result = await client.mintWithFaucetService(address, BigNumber(amount).times(1e6).toString(10))

  return {
    result: result,
    address: address,
    amount: BigNumber(amount).toString(10)
  }
}

const transfer = async function (mnemonic, toAddress, amount) {
  console.log('[mnemonic] ', mnemonic);
  console.log('[toAddress] ', toAddress);
  console.log('[amount] ', amount);
  const client = new LibraClient({ network: LibraNetwork.Testnet })
  const wallet = new LibraWallet({ mnemonic: mnemonic })
  const account = wallet.generateAccount(0)
  const amountToTransfer = BigNumber(amount).times(1e6)

  // Stamp account state before transfering
  const beforeAccountState = await client.getAccountState(account.getAddress())

  // Transfer
  const response = await client.transferCoins(account, toAddress, amountToTransfer)
  console.log('[response.acStatus] ', response.acStatus);

  if (response.acStatus && response.acStatus !== LibraAdmissionControlStatus.ACCEPTED) {
    console.log(JSON.stringify(response))
    throw new Error(`admission_control failed with status ${LibraAdmissionControlStatus[response.acStatus]}`)
  }

  // Ensure sender account balance was reduced accordingly

  return {
    response: response,
    address: account.getAddress().toHex()
  }
}



const queryTransactionHistory = async function (address) {
  // Get transaction histories from libexplorer
  const url = `https://api-test.libexplorer.com/api?module=account&action=txlist&address=${address}`
  console.log(`calling ${url}`)
  const response = await axios.get(url, { timeout: 10000 }).then(resp => resp).catch(error => ({ error: error.message }))
  // Valdiate response
  if (response.error || response.data.status !== '1') {
    if (response.data.status === '0') {
      // Case of Invalid address format
      if (response.data.message === 'NOTOK') {
        throw new Error(response.data.result)

        // Case of No transactions found
      } else if (response.data.message === 'No transactions found') {
        return []
      }
    }

    const msg = response.error ? response.error : JSON.stringify(response.data)
    console.error(`Failed response ${msg}`)
    throw new Error(`Internal server error`)
  }

  // console.log(response.data.result)

  // Transform data
  let transactions = response.data.result.map(transaction => {
    // Convert from micro libras
    const amountInBaseUnit = BigNumber(transaction.value).div(1e6)
    let output = {
      amount: amountInBaseUnit.toString(10),
      fromAddress: transaction.from,
      toAddress: transaction.to,
      date: moment.utc(parseInt(transaction.expirationTime) * 1000).format(),
      transactionVersion: parseInt(transaction.version),
      explorerLink: `https://libexplorer.com/version/${transaction.version}`
    }
    // Mint
    if (transaction.from === '0000000000000000000000000000000000000000000000000000000000000000') {
      output.event = 'mint'
      output.type = 'mint_transaction'
      // Sent
    } else if (transaction.from.toLowerCase() === address.toLowerCase()) {
      output.event = 'sent'
      output.type = 'peer_to_peer_transaction'
      // Received
    } else {
      output.event = 'received'
      output.type = 'peer_to_peer_transaction'
    }
    return output
  })

  // Sort by transaction version desc
  transactions = transactions.sort((a, b) => {
    return b.transactionVersion - a.transactionVersion
  })

  return transactions
}


module.exports = {
  createWallet,
  queryBalance,
  transfer,
  mint,
  queryTransactionHistory

}