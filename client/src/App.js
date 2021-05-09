import './App.css'
import { unlockAccount } from './api/web3'
import useAsync from './components/useAsync'
import { useWeb3Context } from './contexts/web3'
// import { useEffect } from 'react'
import Wallet from './components/Wallet'
import {
  Button,
  Box,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Stack,
  Divider,
  Flex,
  HStack,
  Link,
} from '@chakra-ui/react'

// const useMountEffect = (fn) => useEffect(fn, [])

function App() {
  const { pending, error, execute } = useAsync(unlockAccount)
  const {
    state: { account, network },
    updateAccount,
  } = useWeb3Context()

  // fetch web3
  // useMountEffect(() => {
  //   execute(null).then(({ error, data }) => {
  //     if (error) {
  //       console.error(error)
  //     }
  //     if (data) {
  //       updateAccount(data)
  //     }
  //   })
  // })

  async function connnectToMetamask() {
    const { error, data } = await execute(null)

    if (error) {
      console.error(error)
    }
    if (data) {
      updateAccount(data)
    }
  }

  return (
    <div className="App">
      <Box w={500} p={4} m="20px auto">
        <Heading as="h1" size="xl" textAlign="center">
          Multi Sig Wallet
        </Heading>
        <Divider my={4} />
        <Box m="20px auto" my={4}>
          {account ? (
            <div>
              <Heading as="h2" size="xl">
                Info
              </Heading>
              <Stack spacing={3} my={4}>
                <Text>NetworkID: {network}</Text>
                <Text>Account: {account}</Text>
                <Wallet />
              </Stack>
            </div>
          ) : (
            <Stack>
              <Alert
                status="warning"
                justifyContent="center"
                textAlign="center"
                my={4}
              >
                <AlertIcon />
                Metamask is not connected.
              </Alert>
              <Button onClick={connnectToMetamask}>Connect to Metamask</Button>
            </Stack>
          )}
        </Box>
      </Box>

      <Flex
        bg="white"
        width="100%"
        justifyContent="center"
        alignItems="center"
        direction="column"
        padding={4}
      >
        <HStack spacing={8} mb={8}>
          <Text color="gray.500">
            <Link href="https://ozgun.me/">Mert Ozgun</Link> |{' '}
            <Link href="https://github.com/m2ozgun/multisigwallet">Github</Link>
          </Text>
        </HStack>
      </Flex>
    </div>
  )
}

export default App
