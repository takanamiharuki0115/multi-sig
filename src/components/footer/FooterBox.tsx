import Link from 'next/link'
import React, { Fragment } from 'react'
import {
  Box,
  HStack,
  Text,
  useMediaQuery,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  useStyleConfig
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

import FooterLink from './FooterLink'

const FooterBox: React.FC = () => {
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)', {
    ssr: true,
    fallback: false // return false on the server, and re-evaluate on the client side
  })

  const styles = useStyleConfig('Card')

  const menu = [
    {
      name: 'Smart Contract Repository',
      link: 'https://github.com/marc-aurele-besner/mymultisig-contract',
      imagePath: '/images/github.png',
      target: '_blank'
    },
    {
      name: 'This Repository',
      link: 'https://github.com/marc-aurele-besner/mymultisig-app',
      imagePath: '/images/github.png',
      target: '_blank'
    }
  ]

  return (
    <Box w='80vw' h='100%' p={4} m={2} mt={4} borderRadius={10} __css={styles}>
      <HStack>
        <FooterLink name='MyMultiSig.app' link='/' imagePath='/icons/android-icon-512x512.png' />
        {isLargerThan800 ? (
          <Fragment>
            {menu.map((item) => (
              <FooterLink
                key={`Link-${item.name}`}
                name={item.name}
                link={item.link}
                imagePath={item.imagePath}
                target={item.target}
              />
            ))}
          </Fragment>
        ) : (
          <Box ml='2rem'>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                color={'white'}
                bg='transparent'
                _focus={{
                  outline: 'none',
                  color: 'cyan.600'
                }}
                _active={{
                  outline: 'none',
                  color: 'cyan.600'
                }}>
                Menu
              </MenuButton>
              <MenuList bg='cyan.200'>
                {menu.map((item) => (
                  <MenuItem key={`MenuItem-${item.link}`} bg='cyan.100' color='cyan.900'>
                    <Link key={`Link-${item.link}`} href={item.link}>
                      <Text
                        key={`LinkText-${item.link}`}
                        fontSize='lg'
                        fontWeight='bold'
                        color='cyan.900'
                        pl='1rem'
                        _hover={{
                          color: 'cyan.600'
                        }}>
                        {item.name}
                      </Text>
                    </Link>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        )}
      </HStack>
    </Box>
  )
}

export default FooterBox
