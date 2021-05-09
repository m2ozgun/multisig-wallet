import React, {
  useReducer,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { subscribeToAccount, subscribeToNetwork } from '../api/web3'
import web3Reducer, { WEB3_DEFAULT_STATE } from '../reducers/web3'
import { UPDATE_ACCOUNT, UPDATE_NETWORK } from '../actions/types'

const Web3Context = createContext({
  state: WEB3_DEFAULT_STATE,
  updateAccount: (_data) => {},
  updateNetwork: (_data) => {},
})

export function useWeb3Context() {
  return useContext(Web3Context)
}

export const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(web3Reducer, WEB3_DEFAULT_STATE)
  function updateAccount(data) {
    dispatch({
      type: UPDATE_ACCOUNT,
      ...data,
    })
  }

  function updateNetwork(data) {
    dispatch({
      type: UPDATE_NETWORK,
      ...data,
    })
  }

  return (
    <Web3Context.Provider
      value={useMemo(() => ({ state, updateAccount, updateNetwork }), [state])}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function Web3Updater() {
  const { state, updateNetwork } = useWeb3Context()

  useEffect(() => {
    if (state.web3) {
      const unsubscribe = subscribeToNetwork(state.web3, (error, network) => {
        if (error) {
          console.log(error)
        }
        if (network) {
          if (state.network === 0) {
            updateNetwork({ network })
          }
        } else if (network !== state.network) {
          window.location.reload()
        }
      })
      return unsubscribe
    }
  }, [state.web3, state.network, updateNetwork])

  useEffect(() => {
    if (state.web3) {
      const unsubscribe = subscribeToAccount(state.web3, (error, account) => {
        if (error) {
          console.log(error)
        }
        if (account !== undefined && account !== state.account) {
          window.location.reload()
        }
      })

      return unsubscribe
    }
  }, [state.web3, state.account])

  return null
}
