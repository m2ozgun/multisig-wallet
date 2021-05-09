import Web3 from 'web3'
import BN from 'bn.js'
import React, {
  useReducer,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { useWeb3Context } from './web3'
import { getWallet, subscribe } from '../api/wallet'
import {
  SET_CONTRACT,
  UPDATE_BALANCE,
  ADD_TRANSACTION,
  UPDATE_TRANSACTION,
} from '../actions/types'
import { WalletReducer, WALLET_DEFAULT_STATE } from '../reducers/wallet'

const WalletContext = createContext({
  state: WALLET_DEFAULT_STATE,
  setContract: (_data) => {},
  updateBalance: (_data) => {},
  addTransaction: (_data) => {},
  updateTransaction: (_data) => {},
})

export function useWalletContext() {
  return useContext(WalletContext)
}

export const WalletProvider = ({ children }) => {
  const [state, dispatch] = useReducer(WalletReducer, WALLET_DEFAULT_STATE)

  function setContract(data) {
    dispatch({
      type: SET_CONTRACT,
      data,
    })
  }

  function updateBalance(data) {
    dispatch({
      type: UPDATE_BALANCE,
      data,
    })
  }

  function addTransaction(data) {
    dispatch({
      type: ADD_TRANSACTION,
      data,
    })
  }

  function updateTransaction(data) {
    dispatch({
      type: UPDATE_TRANSACTION,
      data,
    })
  }

  return (
    <WalletContext.Provider
      value={useMemo(
        () => ({
          state,
          setContract,
          updateBalance,
          addTransaction,
          updateTransaction,
        }),
        [state],
      )}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function WalletUpdater() {
  const {
    state: { web3, account },
  } = useWeb3Context()
  const {
    state,
    setContract,
    updateTransaction,
    addTransaction,
    updateBalance,
  } = useWalletContext()

  useEffect(() => {
    async function get(web3, account) {
      try {
        const data = await getWallet(web3, account)
        setContract(data)
      } catch (err) {
        console.log(err)
      }
    }

    if (web3) {
      get(web3, account)
    }
  }, [web3])

  useEffect(() => {
    if (web3 && state.address) {
      return subscribe(web3, state.address, (err, log) => {
        console.log('log', log)
        if (err) {
          console.log(err)
        } else if (log) {
          switch (log.event) {
            case 'Deposit':
              updateBalance(log.returnValues)
              break
            case 'Submit':
              addTransaction(log.returnValues)
              break
            case 'Confirm':
              updateTransaction({
                ...log.returnValues,
                confirmed: true,
                account,
              })
              break
            case 'Revoke':
              updateTransaction({
                ...log.returnValues,
                confirmed: false,
                account,
              })
              break
            case 'Execute':
              updateTransaction({
                ...log.returnValues,
                executed: true,
                account,
              })
              break
            default:
              console.log(log)
              break
          }
        }
      })
    }
  }, [])
  return null
}
