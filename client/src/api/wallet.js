import Web3 from 'web3'
import BN from 'bn.js'
import TruffleContract from '@truffle/contract'
import WalletArtifact from '../contracts/MSWallet.json'

const wallet = TruffleContract(WalletArtifact)

export const getWallet = async (web3) => {
  wallet.setProvider(web3.currentProvider)

  const walletInstance = await wallet.deployed()

  const balance = await web3.eth.getBalance(walletInstance.address)
  const owners = await walletInstance.getOwners()
  const numConfirmationsRequired = (
    await walletInstance.numConfirmationsRequired()
  ).toNumber()
  const transactionCount = (
    await walletInstance.getTransactionCount()
  ).toNumber()

  const transactions = []
  for (let i = 1; i <= 10; i++) {
    const txIndex = transactionCount - i
    if (txIndex < 0) {
      break
    }

    const {
      to,
      value,
      data,
      executed,
      numConfirmations,
    } = await walletInstance.getTransaction(txIndex)
    const isConfirmed = await walletInstance.isConfirmed(txIndex)

    transactions.push({
      txIndex,
      to,
      value,
      data,
      executed,
      numConfirmations: numConfirmations.toNumber(),
      isConfirmedByCurrentAccount: isConfirmed,
    })
  }

  return {
    address: walletInstance.address,
    balance,
    owners,
    numConfirmationsRequired,
    transactionCount,
    transactions,
  }
}

export const confirmTransaction = async (web3, account, params) => {
  const { txIndex } = params

  wallet.setProvider(web3.currentProvider)
  const walletInstance = await wallet.deployed()

  await walletInstance.confirm(txIndex, { from: account })
}

export const submitTransaction = async (web3, account, params) => {
  const { to, value, data } = params

  wallet.setProvider(web3.currentProvider)
  const walletInstance = await wallet.deployed()

  await walletInstance.submit(to, value, data, { from: account })
}

export const revokeConfirmation = async (web3, account, params) => {
  const { txIndex } = params

  wallet.setProvider(web3.currentProvider)
  const walletInstance = await wallet.deployed()

  await walletInstance.revoke(txIndex, { from: account })
}

export const executeTransaction = async (web3, account, params) => {
  const { txIndex } = params

  wallet.setProvider(web3.currentProvider)
  const walletInstance = await wallet.deployed()

  await walletInstance.execute(txIndex, { from: account })
}

export function subscribe(web3, address, callback) {
  const walletInstance = new web3.eth.Contract(wallet.abi, address)

  const res = walletInstance.allEvents((error, log) => {
    if (error) {
      callback(error, null)
    } else if (log) {
      callback(null, log)
    }
  })

  return () => res.unsubscribe()
}
