import React, { useState } from 'react'
import { submitTransaction } from '../api/wallet'
import { useWeb3Context } from '../contexts/web3'
import useAsync from './useAsync'
import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react'

const CreateTransaction = () => {
  const {
    state: { web3, account },
  } = useWeb3Context()
  const [inputs, setInputs] = useState({ to: '', value: 0, data: '' })
  const { pending, error, execute } = useAsync(async (params) => {
    if (!web3) {
      throw new Error('No web3 instance available.')
    }

    await submitTransaction(web3, account, params)
  })

  const onChange = (name, event) => {
    setInputs({
      ...inputs,
      [name]: event.target.value,
    })
  }

  const onSubmit = async () => {
    if (pending) {
      return
    }

    const { error } = await execute({
      ...inputs,
      value: inputs.value.toString(),
    })
  }

  return (
    <Box>
      <FormControl
        id="to"
        isRequired
        my={3}
        value={inputs.to}
        onChange={(e) => onChange('to', e)}
      >
        <FormLabel>Receipient</FormLabel>
        <Input placeholder="0x00" />
      </FormControl>
      <FormControl
        id="value"
        isRequired
        my={3}
        value={inputs.value}
        onChange={(e) => onChange('value', e)}
      >
        <FormLabel>Value</FormLabel>
        <Input placeholder="0" />
      </FormControl>
      <FormControl
        id="data"
        isRequired
        my={3}
        value={inputs.data}
        onChange={(e) => onChange('data', e)}
      >
        <FormLabel>Data</FormLabel>
        <Input placeholder="0x00" />
      </FormControl>
      <Button isFullWidth my={3} onClick={onSubmit}>
        Create Transaction
      </Button>
    </Box>
  )
}

export default CreateTransaction
