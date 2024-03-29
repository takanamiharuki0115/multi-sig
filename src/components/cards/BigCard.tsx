import React from 'react'
import { Box } from '@chakra-ui/react'
import { cardColors } from '../../styles/colors'

interface BigCardProps {
  children: React.ReactNode
  w?: string
  h?: string
}

const BigCard: React.FC<BigCardProps> = ({ children, w = '98vw', h = '80vh' }) => {
  return (
    <Box w={w} h={h} p={4} m={2} mt={4} borderRadius={10} {...cardColors}>
      {children}
    </Box>
  )
}

export default BigCard
