import React, { Fragment, useState } from 'react'
import Link from 'next/link'
import { Box, Button, Center, HStack, Text, Textarea } from '@chakra-ui/react'

import SignRequest from '../buttons/SignRequest'
import ExecuteRequest from '../buttons/ExecuteRequest'
import useMultiSigRequestDetails from '../../hooks/useMultiSigRequestDetails'
import useDeleteMultiSigRequest from '../../hooks/useDeleteMultiSigRequest'
import useResetMultiSigRequest from '../../hooks/useResetMultiSigRequest'
import useMultiSigDetails from '../../hooks/useMultiSigDetails'
import useMultiSigs from '../../states/multiSigs'

interface MultiSigRequestDetailProps {
  address: `0x${string}`
  multiSigRequestId: string
}

const MultiSigRequestDetail: React.FC<MultiSigRequestDetailProps> = ({ address, multiSigRequestId }) => {
  const [isDeleted, setIsDeleted] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const requestDetails = useMultiSigRequestDetails(multiSigRequestId)
  const { multiSigDetails } = useMultiSigDetails(
    requestDetails != null ? requestDetails.data.multiSigAddress : '0x',
    address
  )

  const deleted = useDeleteMultiSigRequest(multiSigRequestId, requestDetails?.ref['@ref'].id, isDeleted)
  const { setSelectedMultiSigTransactionRequest } = useMultiSigs()

  useResetMultiSigRequest(multiSigRequestId, requestDetails?.ref['@ref'].id, isReset)
  if (deleted) setSelectedMultiSigTransactionRequest(null)

  if (requestDetails == null || multiSigDetails == null) return null

  return (
    <Fragment>
      <HStack pl='1.5rem' pr='1.5rem'>
        <Link href={`/multisig/${requestDetails.data.multiSigAddress}/buildRequest`}>
          <Button colorScheme='blue' m='1rem' mr='2rem'>
            Build a request
          </Button>
        </Link>
        <Link href={`/multisig/${requestDetails.data.multiSigAddress}/requests`}>
          <Button colorScheme='blue' m='1rem' mr='2rem'>
            Consult requests
          </Button>
        </Link>
      </HStack>
      <Box border='1px' borderColor='white' borderRadius='5px' p='1rem'>
        <HStack key={`Request-Title`}>
          <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            Description
          </Text>
          <Text fontSize='lg' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            {requestDetails.data.description}
          </Text>
        </HStack>
        <HStack key={`Request-SubmittedDate`}>
          <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            Submitted date
          </Text>
          <Text fontSize='lg' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            {new Date(Number(requestDetails.data.dateSubmitted)).toLocaleDateString()}
          </Text>
        </HStack>
        <HStack key={`Request-Target`}>
          <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            Target
          </Text>
          <Text fontSize='lg' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            {requestDetails.data.request.to}
          </Text>
        </HStack>
        <HStack key={`Request-Data`}>
          <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            Data
          </Text>
          <Textarea isReadOnly defaultValue={requestDetails.data.request.data} />
        </HStack>
        <HStack key={`Request-Value`}>
          <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            Value
          </Text>
          <Text fontSize='lg' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            {requestDetails.data.request.value}
          </Text>
        </HStack>
        <HStack key={`Request-TxGas`}>
          <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            Tx. Gas
          </Text>
          <Text fontSize='lg' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            {requestDetails.data.request.txnGas}
          </Text>
        </HStack>
        <HStack key={`Request-SignaturesVsThreshold`}>
          <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            Signatures qty. / Threshold
          </Text>
          <Text fontSize='lg' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
            {requestDetails.data.signatures.length} / {multiSigDetails.threshold}
          </Text>
        </HStack>
        {requestDetails.data.isExecuted ? (
          <>
            <HStack key={`Request-Sign`}>
              <Text fontSize='xl' fontWeight='bold' color='green' m='0.5rem' pt='0.5rem'>
                This request has been executed
                {requestDetails.data.dateExecuted &&
                  ' on the ' + new Date(Number(requestDetails.data.dateExecuted)).toLocaleDateString()}
              </Text>
            </HStack>
          </>
        ) : (
          <Fragment>
            {requestDetails.data.signatures.length >= multiSigDetails.threshold && (
              <HStack key={`Request-Execute`}>
                <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
                  Execute this request
                </Text>
                <ExecuteRequest
                  multiSigAddress={requestDetails.data.multiSigAddress}
                  args={requestDetails.data.request}
                  requestDetails={requestDetails.data}
                  existingRequestRef={requestDetails.data.id}
                />
              </HStack>
            )}
            <HStack key={`Request-Sign`}>
              <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
                Sign this request
              </Text>
              <Fragment>
                {requestDetails.data.ownerSigners.find((signature) => signature === address) ? (
                  <Text color='green' fontSize='xl' fontWeight='bold' m='0.5rem' pt='0.5rem'>
                    You already signed this request
                  </Text>
                ) : (
                  <SignRequest
                    multiSigAddress={requestDetails.data.multiSigAddress}
                    args={requestDetails.data.request}
                    description={requestDetails.data.description}
                    requestDetails={requestDetails.data}
                    existingRequestRef={requestDetails.data.id}
                  />
                )}
              </Fragment>
            </HStack>
            <HStack key={`Request-ClearSignatures`}>
              <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
                Clear signatures
              </Text>
              <Text fontSize='lg' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
                <Button colorScheme='orange' m='1rem' mr='2rem' onClick={() => setIsReset(true)}>
                  Reset signatures
                </Button>
              </Text>
            </HStack>
            <HStack key={`Request-Delete`}>
              <Text fontSize='xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
                Delete this request
              </Text>
              <Text fontSize='lg' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
                <Button colorScheme='red' m='1rem' mr='2rem' onClick={() => setIsDeleted(true)}>
                  Delete
                </Button>
              </Text>
            </HStack>
          </Fragment>
        )}
      </Box>
      <Center>
        <Link
          href={`/multisig/${requestDetails.data.multiSigAddress}/requests`}
          onClick={() => setSelectedMultiSigTransactionRequest(null)}>
          <Button colorScheme='blue' m='1rem' mr='2rem'>
            View a different request
          </Button>
        </Link>
      </Center>
    </Fragment>
  )
}

export default MultiSigRequestDetail
