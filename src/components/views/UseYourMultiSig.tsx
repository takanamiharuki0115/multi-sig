import React, { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import { Center, VStack, Text, Box } from '@chakra-ui/react'
import { useAccount, useNetwork } from 'wagmi'

import BigCard from '../cards/BigCard'
import ErrorCard from '../cards/ErrorCard'
import ConnectWallet from './ConnectWallet'
import ImageButton from '../buttons/ImageButton'
import MultiSigList from '../multiSigDetails/MultiSigList'
import useMultiSigs from '../../states/multiSigs'

const UseYourMultiSig: React.FC = () => {
  const [hasMounted, setHasMounted] = useState(false)
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { multiSigs, clearAllMultiSig } = useMultiSigs()

  const filteredMultiSigs = chain ? multiSigs.filter((multiSig) => multiSig.chainId === chain.id) : []

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  return (
    <Center>
      <BigCard w='80vw' h='max'>
        <Center>
          <VStack>
            <Text fontSize='2xl' fontWeight='bold' color='white' pb='1rem'>
              Use your multiSig
            </Text>
            {!hasMounted || !isConnected || address === undefined ? (
              <Fragment>
                <ErrorCard>Please connect your wallet first</ErrorCard>
                <ConnectWallet />
              </Fragment>
            ) : (
              <Fragment>
                {filteredMultiSigs.length === 0 ? (
                  <ErrorCard>
                    You don&apos;t have seem to have any multi-signatures contract on this network. <br />
                    Please create one first or import one.
                  </ErrorCard>
                ) : (
                  <Fragment>
                    <Text fontSize='2xl' fontWeight='bold' color='white' m='0.5rem' pt='0.5rem'>
                      Select a MultiSig to use
                    </Text>
                    {filteredMultiSigs.map((multiSig, index) => (
                      <MultiSigList
                        key={`${multiSig.address}-${index}}`}
                        multiSigAddress={multiSig.address}
                        address={address}
                      />
                    ))}
                  </Fragment>
                )}
                <Text fontSize='2xl' fontWeight='bold' color='white' m='0.5rem'>
                  Other options
                </Text>
                <Box border='1px' borderColor='white' borderRadius='5px' p='1rem' w='100%'>
                  <Link href='/importMultiSig'>
                    <ImageButton placeholder='Import a multiSig' imagePath='/images/import.png' onClick={() => null} />
                  </Link>
                  {multiSigs.length > 0 && (
                    <ImageButton
                      placeholder='Remove all multiSig'
                      imagePath='/images/clear.png'
                      onClick={() => clearAllMultiSig()}
                    />
                  )}
                </Box>
              </Fragment>
            )}
          </VStack>
        </Center>
      </BigCard>
    </Center>
  )
}

export default UseYourMultiSig
