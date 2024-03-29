import { useState } from 'react'
import { useContractEvent, useNetwork } from 'wagmi'
import MyMultiSigFactory from 'mymultisig-contract/abi/MyMultiSigFactory.json'
import { BigNumber } from 'ethers'

import { MultiSig } from '../models/MultiSigs'
import useMultiSigs from '../states/multiSigs'
import { signData, addContent } from '../utils'

const useMyMultiSigCreated = (multiSigFactoryAddress: `0x${string}`) => {
  const { chain } = useNetwork()
  const { addMultiSig } = useMultiSigs()
  const [multiSigAddress, setMultiSigAddress] = useState<string | undefined>(undefined)

  useContractEvent({
    address: multiSigFactoryAddress,
    abi: MyMultiSigFactory,
    eventName: 'MyMultiSigCreated',
    // listener: (...args: unknown[]) => {
    //   console.log('args', args)
    listener: (creator, contractAddress, contractIndex, contractName, originalOwners) => {
      console.log('MyMultiSigCreated', creator, contractAddress, contractIndex, contractName, originalOwners)
      if (chain) {
        setMultiSigAddress(String(contractAddress))
        const dataToAdd: MultiSig = {
          chainId: chain?.id || 0,
          chainName: chain?.name || 'unknown',
          factoryAddress: multiSigFactoryAddress,
          id: BigNumber.from(contractIndex).toNumber(),
          name: String(contractName),
          version: '0.0.2',
          address: `0x${String(contractAddress).substring(2)}`,
          threshold: 2,
          ownerCount: Array(originalOwners).length,
          nonce: 0,
          owners: Array(originalOwners).map((owner) => String(owner)),
          isDeployed: true
        }
        addMultiSig(dataToAdd)
        signData({
          action: 'createMultiSigWallet',
          chainId: chain.id,
          collection: 'multisig-wallets',
          data: dataToAdd,
          details: 'Add MultiSig wallets',
          signatureExpiry: 0
        }).then(async (dataSigned) => {
          addContent(dataSigned.message).then(() => {
            // console.log('addContent', dataSigned)
          })
        })
      }
    }
  })

  return {
    multiSigAddress
  }
}

export default useMyMultiSigCreated
