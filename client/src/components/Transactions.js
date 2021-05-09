import React from 'react'
import { useWeb3Context } from '../contexts/web3'
import useAsync from './useAsync'
import * as walletApi from '../api/wallet'
import {
  Button,
  Box,
  Text,
  Divider,

} from '@chakra-ui/react'

const TransactionActions = ({ transaction, numConfirmationsRequired }) => {
  const {
    state: { web3, account },
  } = useWeb3Context()

  const { txIndex } = transaction

  const confirm = useAsync(async () => {

    if (!web3) {
      throw new Error('Web3 is not found!')
    }

    await walletApi.confirmTransaction(web3, account, { txIndex })
  })

  const revoke = useAsync(async () => {
    if (!web3) {
      throw new Error('Web3 is not found!')
    }

    await walletApi.revokeConfirmation(web3, account, { txIndex })
  })

  const execute = useAsync(async () => {
    if (!web3) {
      throw new Error('Web3 is not found!')
    }

    await walletApi.executeTransaction(web3, account, { txIndex })
  })

  return (
    <div>
      {!transaction.executed ? (
        transaction.isConfirmedByAccount ? (
          <Button
            onClick={(e) => revoke.execute(null)}
            disabled={revoke.pending}
          >
            Revoke
          </Button>
        ) : (
          <Button
            onClick={() => confirm.execute(null)}
            disabled={confirm.pending}
          >
            Confirm
          </Button>
        )
      ) : null}

      {!transaction.executed ? (
        transaction.numConfirmations >= numConfirmationsRequired ? (
          <Button onClick={() => execute.execute(null)}>Execute</Button>
        ) : null
      ) : null}
    </div>
  )
}

const Transaction = ({ transaction }) => {
  return (
    <div>
      <Text>Index: {transaction.txIndex}</Text>
      <Text>To: {transaction.to}</Text>
      <Text>Value: {transaction.value.toString()}</Text>
      <Text>Value: {transaction.data}</Text>
      <Text>Status: {transaction.executed ? 'executed' : 'pending'}</Text>
      <Text>Confirmations: {transaction.numConfirmations}</Text>
    </div>
  )
}

const Transactions = ({ numConfirmationsRequired, data }) => {
  return (
    <Box>
      {data.map((transaction) => (
        <div key={transaction.txIndex}>
          <Transaction transaction={transaction} />
          <TransactionActions
            transaction={transaction}
            numConfirmationsRequired={numConfirmationsRequired}
          />
          <Divider my={2} />
        </div>
      ))}
    </Box>
  )
}

export default Transactions
