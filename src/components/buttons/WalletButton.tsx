import React from 'react'
import { Button, HStack, Image, Text } from '@chakra-ui/react'

interface WalletButtonProps {
  placeholder: string
  imagePath: string
  onClick?: () => void
  isLoading?: boolean
  isDisabled?: boolean
}

const WalletButton: React.FC<WalletButtonProps> = ({ placeholder, imagePath, onClick, isLoading, isDisabled }) => {
  return (
    <Button
      key={placeholder}
      w='94%'
      p={4}
      m={2}
      mt={4}
      borderRadius={10}
      bg='cyan.100'
      boxShadow='dark-lg'
      onClick={onClick}
      isLoading={isLoading}
      isDisabled={isDisabled}
      _hover={{
        bg: 'cyan.300',
      }}>
      <HStack w='100%' justifyContent='center'>
        <Image src={imagePath} alt={placeholder} width={25} height={25} borderRadius='3px' />
        <Text>{placeholder}</Text>
      </HStack>
    </Button>
  )
}

export default WalletButton
