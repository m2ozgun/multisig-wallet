import React from 'react'
import { useWalletContext } from '../contexts/wallet'
import { Box, Heading, Text, Stack } from '@chakra-ui/react'
import CreateTransaction from './CreateTransaction'
import Transactions from './Transactions'
function Wallet() {
  const {
    state: {
      address,
      balance,
      owners,
      numConfirmationsRequired,
      transactions,
    },
  } = useWalletContext()

  return (
    <Stack spacing={3} my={4}>
      <Text>Contract: {address}</Text>
      <Text>Contract Balance: {balance} wei</Text>
      <Heading as="h2" size="xl">
        Owners
      </Heading>
      <Box>
        {owners.map((owner, i) => (
          <Text key={i}>{owner}</Text>
        ))}
      </Box>
      <Heading as="h2" size="xl">
        Create Transaction
      </Heading>

      <CreateTransaction />

      <Heading as="h2" size="xl">
        Transactions
      </Heading>
      <Transactions
        numConfirmationsRequired={numConfirmationsRequired}
        data={transactions}
      ></Transactions>
    </Stack>
  )
}

export default Wallet
