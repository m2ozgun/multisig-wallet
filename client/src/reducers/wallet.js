import Web3 from 'web3'
import {
  SET_CONTRACT,
  UPDATE_BALANCE,
  ADD_TRANSACTION,
  UPDATE_TRANSACTION,
} from '../actions/types'

export const WALLET_DEFAULT_STATE = {
  address: '',
  balance: '0',
  owners: [],
  numConfirmationsRequired: 0,
  transactionCount: 0,
  transactions: [],
}

export const WalletReducer = (state = WALLET_DEFAULT_STATE, action) => {
  let transactions
  switch (action.type) {
    case SET_CONTRACT:
      return {
        ...state,
        ...action.data,
      }
    case UPDATE_BALANCE:
      return {
        ...state,
        ...action.data.balance,
      }
    case ADD_TRANSACTION:
      transactions = [
        ...state.transactions,
        {
          txIndex: parseInt(action.txIndex),
          to: action.to,
          value: Web3.utils.toBN(action.value),
          data: action.to,
          executed: false,
          numConfirmations: 0,
          isConfirmedByCurrentAccount: false,
        },
      ]

      return {
        ...state,
        transactionCount: state.transactionCount + 1,
        transactions,
      }
    case UPDATE_TRANSACTION:
      const { data } = action
      const txIndex = parseInt(data.txIndex)

      state.transactions.map((transaction) => {
        if (txIndex === transaction.txIndex) {
          const updatedTx = {
            ...transaction,
          }

          if (data.executed) {
            updatedTx.executed = true
          }
          if (data.confirmed !== undefined) {
            if (data.confirmed) {
              updatedTx.numConfirmations += 1
              updatedTx.isConfirmedByCurrentAccount =
                data.owner === data.account
            } else {
              updatedTx.numConfirmations -= 1
              if (data.owner === data.account) {
                updatedTx.isConfirmedByCurrentAccount = false
              }
            }
          }

          return updatedTx
        }

        return transaction
      })
      return {
        ...state,
        transactions,
      }

    default:
      return state
  }
}
