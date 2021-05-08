import React, { useState } from 'react'
import { useWalletContext } from '../contexts/wallet'
import {
  Button,
  Box,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Stack,
  Divider,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react'
function Wallet() {
  const {
    state: { address, balance, owners },
  } = useWalletContext()

  console.log(address, balance, owners)
  const [open, openModal] = useState(false)

  return (
    <Stack spacing={3} my={4}>
      <Text>Contract: {address}</Text>
      <Text>Balance: {balance}</Text>
      <Heading as="h2">Owners</Heading>
      <UnorderedList>
        {owners.map((owner, i) => (
          <ListItem key={i}>{owner}</ListItem>
        ))}
      </UnorderedList>
    </Stack>
  )
}

export default Wallet
