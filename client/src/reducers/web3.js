import { UPDATE_ACCOUNT, UPDATE_NETWORK } from '../actions/types'

export const WEB3_DEFAULT_STATE = {
  account: '',
  web3: null,
  network: 0,
}

const web3Reducer = (state = WEB3_DEFAULT_STATE, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT:
      const { account, web3 } = action
      return {
        ...state,
        web3: web3 || state.web3,
        account,
      }
    case UPDATE_NETWORK:
      const { network } = action
      return {
        ...state,
        network,
      }

    default:
      return state
  }
}

export default web3Reducer
