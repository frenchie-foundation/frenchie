import React, { useCallback, useEffect } from 'react';
import { Container, HStack, Link } from '@chakra-ui/layout';
import {
  Heading,
  Box,
  Image,
  Flex,
  Text,
  Button,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';

import {
  FaNewspaper,
  FaTelegram,
  FaMedium,
  FaTwitter,
  FaDiscord,
  FaReddit,
  FaInstagram,
  FaGithub,
  FaTractor,
} from 'react-icons/fa';
import openInNewTab from '../helpers/openInNewTab';
import constants from '../config/constants';
import Title from '../components/Title';
import latokenlogo from '../assets/images/latoken.png';
import frenchiefarm from '../assets/images/frenchie-farm.png';
import frenchie from '../assets/images/logo.svg';
import frenchieblockchain from '../assets/images/frenchie-blockchain.png';
import bscscanLogo from '../assets/images/bscscan-logo-circle.svg';
import { useHistory } from 'react-router';

export default function HomePage(): React.ReactElement {
  useEffect(() => {
    document.title = 'Frenchie Network';
  }, []);

  const history = useHistory();

  const handleTelegramLinkClick = useCallback(() => {
    openInNewTab(constants.telegramGroupLink);
  }, []);
  const handleTwitterClick = useCallback(() => {
    openInNewTab(constants.twitterGroupLink);
  }, []);
  const handleMediumClick = useCallback(() => {
    openInNewTab(constants.mediumGroupLink);
  }, []);
  const handleWhitepaperLinkClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openInNewTab('/frenchie-whitepaper.pdf');
  }, []);

  const handleFarmClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openInNewTab('/farming');
  }, []);

  const handleBuyLinkClick = useCallback(() => {
    openInNewTab('/swap');
  }, []);

  const goTo = useCallback(
    (path: string) => (e?: any) => {
      if (e) {
        e.preventDefault();
      }
      history.push(path);
    },
    [history]
  );

  return (
    <Container>
      <Box mt={16} mb={4}>
        <Title lineHeight="48px" isPageTitle>
          More Than A Meme
        </Title>
        <Title isPageTitle color={constants.colors.red}>
          <span style={{ color: constants.colors.green }}>An Eco</span> Smart
          Chain
        </Title>
      </Box>
      <Flex mb={16} gridGap={4}>
        <Button
          variant="outline"
          px={7}
          py={6}
          onClick={handleBuyLinkClick}
          fontSize="20px"
          bgColor={constants.colors.darkerLight}
          color={constants.colors.dark}
          transition="0.2s"
          _hover={{
            boxShadow: 'xl',
          }}
        >
          How to Buy
        </Button>
        <Button
          variant="outline"
          color={constants.colors.white}
          borderColor={constants.colors.white}
          px={7}
          py={6}
          fontSize="20px"
          leftIcon={<FaTractor />}
          onClick={handleFarmClick}
          transition="0.2s"
          _hover={{
            boxShadow: 'xl',
          }}
        >
          Farm
        </Button>
        <Button
          variant="outline"
          color={constants.colors.white}
          borderColor={constants.colors.white}
          px={7}
          py={6}
          fontSize="20px"
          leftIcon={<FaNewspaper />}
          onClick={handleWhitepaperLinkClick}
          transition="0.2s"
          _hover={{
            boxShadow: 'xl',
          }}
        >
          Whitepaper
        </Button>
      </Flex>
      <Box
        rounded={'lg'}
        display={{ base: 'block', md: 'flex' }}
        gridGap={4}
        mb={8}
      >
        <Box
          p={4}
          w="100%"
          h="100%"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'md'}
          borderRadius={8}
        >
          <Flex justifyContent="center" mb={4}>
            <Image src={frenchie} boxSize="75px" />
          </Flex>
          <Title mb={4} textAlign="center">
            Frenchie Network
          </Title>
          <Text>
            <Text display="inline" color={constants.colors.red}>
              Frenchie Network{' '}
            </Text>
            will be a high-performance, scalable, and secure smart-contract
            platform.
            <br />
            It is designed to overcome the limitations of previous generation
            blockchain platforms.
            <br />
            Frenchie Network will be permission-less, decentralized, and
            open-source.
            <br />
            <br />
            Frenchie Network will use a superior consensus mechanism called
            Asynchronous Byzantine Fault Tolerance (aBFT).
            <br />
            <br />
            Network Testnet Estimated by Q4 2021.
          </Text>
        </Box>
        <Box
          p={4}
          w="100%"
          h="100%"
          d="flex"
          flexDir="column"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'md'}
          borderRadius={8}
        >
          <Flex justifyContent="center" mb={4}>
            <Image src={frenchiefarm} boxSize="75px" />
          </Flex>
          <Title mb={4} textAlign="center">
            Farming Rewards
          </Title>
          <Text>
            We have deployed Frenchie Farm contracts on BSC Network
            <Text display="inline" color={constants.colors.red}>
              {' '}
              to reward users{' '}
            </Text>
            that provide liquidity on 1inch Aggregated D.E.X on FREN/BNB pair.
            We redistribute currently over 25 billion FREN from our Marketing
            Funds into our farming pool.
            <br />
            <br />
            We consider it a smart way to reward our investors that wait for our
            Blockchain technology launch and progress. Once that happen they
            will be able to swap their BEP-20 FREN tokens to FREN native coin.
          </Text>
        </Box>
        <Box
          p={4}
          w="100%"
          h="100%"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'md'}
          borderRadius={8}
        >
          <Flex justifyContent="center" mb={4}>
            <Image src={frenchieblockchain} boxSize="75px" />
          </Flex>
          <Title mb={4} textAlign="center">
            Blockchain Innovations
          </Title>
          <Text>
            Frenchie
            <Text display="inline" color={constants.colors.red}>
              {' '}
              won’t be just a meme token
            </Text>
            . We are working on mindblowing blockchain technology for our
            community.
            <br />
            <br />
            Our consensus mechanism Asynchronous Byzantine Fault Tolerance will
            be the highest standard among all consensus algorithms.
            <br />
            <br />
            It solves the blockchain Scalability Trilemma
            <br />
            Decentralization
            <br />
            Security
            <br />
            Scalability
          </Text>
        </Box>
      </Box>

      <Title
        textAlign={'center'}
        fontSize={'4xl'}
        py={10}
        mt={20}
        mb={4}
        fontWeight={'bold'}
      >
        Join our community
      </Title>
      <Flex justifyContent="center" spacing={2} gridGap={3} wrap="wrap">
        <Flex
          onClick={handleTelegramLinkClick}
          gridGap={3}
          alignItems="center"
          flexDir="column"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'md'}
          p={4}
          borderRadius={4}
          transition="0.2s"
          minW="100px"
          cursor="pointer"
          _hover={{
            boxShadow: 'xl',
            backgroundColor: useColorModeValue('white', 'gray.800'),
          }}
        >
          <Icon as={FaTelegram} w={6} h={6} />
          <Text>Telegram</Text>
        </Flex>
        <Flex
          onClick={handleTwitterClick}
          gridGap={3}
          alignItems="center"
          flexDir="column"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'md'}
          p={4}
          borderRadius={4}
          transition="0.2s"
          minW="100px"
          cursor="pointer"
          _hover={{
            boxShadow: 'xl',
            backgroundColor: useColorModeValue('white', 'gray.800'),
          }}
        >
          <Icon as={FaTwitter} w={6} h={6} />
          <Text>Twitter</Text>
        </Flex>
        <Flex
          onClick={handleTwitterClick}
          gridGap={3}
          alignItems="center"
          flexDir="column"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'md'}
          p={4}
          borderRadius={4}
          transition="0.2s"
          minW="100px"
          cursor="pointer"
          _hover={{
            boxShadow: 'xl',
            backgroundColor: useColorModeValue('white', 'gray.800'),
          }}
        >
          <Icon as={FaDiscord} w={6} h={6} />
          <Text>Discord</Text>
        </Flex>
        <Flex
          onClick={handleTwitterClick}
          gridGap={3}
          alignItems="center"
          flexDir="column"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'md'}
          p={4}
          borderRadius={4}
          transition="0.2s"
          minW="100px"
          cursor="pointer"
          _hover={{
            boxShadow: 'xl',
            backgroundColor: useColorModeValue('white', 'gray.800'),
          }}
        >
          <Icon as={FaInstagram} w={6} h={6} />
          <Text>Instagram</Text>
        </Flex>
        <Flex
          onClick={handleTwitterClick}
          gridGap={3}
          alignItems="center"
          flexDir="column"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'md'}
          p={4}
          borderRadius={4}
          transition="0.2s"
          minW="100px"
          cursor="pointer"
          _hover={{
            boxShadow: 'xl',
            backgroundColor: useColorModeValue('white', 'gray.800'),
          }}
        >
          <Icon as={FaGithub} w={6} h={6} />
          <Text>Github</Text>
        </Flex>
        <Flex
          onClick={handleTwitterClick}
          gridGap={3}
          alignItems="center"
          flexDir="column"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'md'}
          p={4}
          borderRadius={4}
          transition="0.2s"
          minW="100px"
          cursor="pointer"
          _hover={{
            boxShadow: 'xl',
            backgroundColor: useColorModeValue('white', 'gray.800'),
          }}
        >
          <Icon as={FaReddit} w={6} h={6} />
          <Text>Reddit</Text>
        </Flex>
        <Flex
          onClick={handleMediumClick}
          gridGap={3}
          alignItems="center"
          flexDir="column"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'md'}
          p={4}
          borderRadius={4}
          transition="0.2s"
          cursor="pointer"
          minW="100px"
          _hover={{
            boxShadow: 'xl',
            backgroundColor: useColorModeValue('white', 'gray.800'),
          }}
        >
          <Icon as={FaMedium} w={6} h={6} />
          <Text>Medium</Text>
        </Flex>
      </Flex>
      <Title
        textAlign={'center'}
        fontSize={'4xl'}
        py={10}
        mt={20}
        mb={4}
        fontWeight={'bold'}
      >
        Parceiros?
      </Title>
      <Flex justifyContent="center">
        <HStack gridGap={4} overflowX="scroll" pb={5}>
          <Link
            href={constants.coinmarketcapGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            textDecoration="none"
            isExternal
            minW="250px"
          >
            <HStack
              d="flex"
              flexDir="column"
              gridGap={3}
              bg={useColorModeValue('white', 'gray.900')}
              boxShadow={'md'}
              borderRadius={8}
              p={4}
              transition="0.2s"
              _hover={{
                background: useColorModeValue('white', 'gray.800'),
                boxShadow: 'xl',
              }}
            >
              <Image
                objectFit="cover"
                boxSize="50px"
                src="https://i2.wp.com/blog.coinmarketcap.com/wp-content/uploads/2019/06/wp-favicon.png"
                alt="CMC"
              />
              <Heading as="h3" size="lg">
                CoinMarketCap
              </Heading>
            </HStack>
          </Link>
          <Link
            href={constants.coingeckoGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            textDecoration="none"
            isExternal
            minW="250px"
          >
            <HStack
              d="flex"
              flexDir="column"
              gridGap={3}
              bg={useColorModeValue('white', 'gray.900')}
              boxShadow={'md'}
              borderRadius={8}
              p={4}
              transition="0.2s"
              _hover={{
                background: useColorModeValue('white', 'gray.800'),
                boxShadow: 'xl',
              }}
            >
              <Image
                objectFit="cover"
                boxSize="50px"
                src="https://i.imgur.com/bjJF07B.png"
                alt="CoinGecko"
              />
              <Heading as="h3" size="lg">
                CoinGecko
              </Heading>
            </HStack>
          </Link>
          <Link
            href={constants.latokenGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            textDecoration="none"
            isExternal
            minW="250px"
          >
            <HStack
              d="flex"
              flexDir="column"
              gridGap={3}
              bg={useColorModeValue('white', 'gray.900')}
              boxShadow={'md'}
              borderRadius={8}
              p={4}
              transition="0.2s"
              _hover={{
                background: useColorModeValue('white', 'gray.800'),
                boxShadow: 'xl',
              }}
            >
              <Image
                objectFit="cover"
                boxSize="50px"
                src={latokenlogo}
                alt="LaToken"
              />
              <Heading as="h3" size="lg">
                LAToken
              </Heading>
            </HStack>
          </Link>
          <Link
            href={constants.dextoolsGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            textDecoration="none"
            isExternal
            minW="250px"
          >
            <HStack
              d="flex"
              flexDir="column"
              gridGap={3}
              bg={useColorModeValue('white', 'gray.900')}
              boxShadow={'md'}
              borderRadius={8}
              p={4}
              transition="0.2s"
              _hover={{
                background: useColorModeValue('white', 'gray.800'),
                boxShadow: 'xl',
              }}
            >
              <Image
                objectFit="cover"
                boxSize="50px"
                src="https://i.imgur.com/lc25mKK.png"
                alt="DexTools"
              />
              <Heading as="h3" size="lg">
                Dextools
              </Heading>
            </HStack>
          </Link>
          <Link
            href={constants.poocoinGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            textDecoration="none"
            isExternal
            minW="250px"
          >
            <HStack
              d="flex"
              flexDir="column"
              gridGap={3}
              bg={useColorModeValue('white', 'gray.900')}
              boxShadow={'md'}
              borderRadius={8}
              p={4}
              transition="0.2s"
              _hover={{
                background: useColorModeValue('white', 'gray.800'),
                boxShadow: 'xl',
              }}
            >
              <Image
                objectFit="cover"
                boxSize="50px"
                src="https://poocoin.app/images/logo/poocoin512.png"
                alt="PooChart"
              />
              <Heading as="h3" size="lg">
                PooChart
              </Heading>
            </HStack>
          </Link>
        </HStack>
      </Flex>
      <Title
        textAlign={'center'}
        fontSize={'4xl'}
        py={10}
        mt={20}
        mb={4}
        fontWeight={'bold'}
      >
        Tokenmetrics
      </Title>
      <Flex justifyContent="space-between" mb={3}>
        <Box>texto aqui</Box>
        <Flex flexDir="column" gridGap={4}>
          <Flex
            flexDir="column"
            alignItems="center"
            p={3}
            minW="200px"
            backgroundColor={useColorModeValue('gray.800', 'gray.900')}
            borderRadius={4}
            transition="0.2s"
            _hover={{
              boxShadow: 'md',
            }}
          >
            <Text>Initial Supply</Text>
            <Text>1,000,000,000,000</Text>
          </Flex>
          <Flex
            flexDir="column"
            alignItems="center"
            p={3}
            minW="200px"
            backgroundColor={useColorModeValue('gray.800', 'gray.900')}
            borderRadius={4}
            transition="0.2s"
            _hover={{
              boxShadow: 'md',
            }}
          >
            <Text>Current Supply</Text>
            <Text>750,000,000,000</Text>
          </Flex>
          <Flex
            flexDir="column"
            alignItems="center"
            p={3}
            minW="200px"
            backgroundColor={useColorModeValue('gray.800', 'gray.900')}
            borderRadius={4}
            transition="0.2s"
            _hover={{
              boxShadow: 'md',
            }}
          >
            <Text>Burned Supply</Text>
            <Text>250,000,000,000</Text>
          </Flex>
          <Flex
            flexDir="column"
            alignItems="center"
            p={3}
            minW="200px"
            backgroundColor={useColorModeValue('gray.800', 'gray.900')}
            borderRadius={4}
            transition="0.2s"
            _hover={{
              boxShadow: 'md',
            }}
          >
            <Text>Liquidity Locked PCSv1</Text>
            <Text>250,000,000,000</Text>
          </Flex>
          <Flex
            flexDir="column"
            alignItems="center"
            p={3}
            minW="200px"
            backgroundColor={useColorModeValue('gray.800', 'gray.900')}
            borderRadius={4}
            transition="0.2s"
            _hover={{
              boxShadow: 'md',
            }}
          >
            <Text>Marketing + DEV</Text>
            <Text>300,000,000,000</Text>
          </Flex>
        </Flex>
      </Flex>
      <Title fontSize={'4xl'} py={2} mt={8} mb={4} fontWeight={'bold'}>
        Contracts
      </Title>

      <Flex flexDir="column" mb={6}>
        <Text mb={4} fontSize="2xl">
          Frenchie Contract:
        </Text>
        <Flex
          gridGap={4}
          alignItems="center"
          bg="gray.900"
          p={4}
          borderRadius={4}
          boxShadow="md"
          w="fit-content"
        >
          <Box>{constants.tokenAddress}</Box>
          <Link href={constants.bscScanLink} target="_blank">
            <Button d="flex" gridGap={3} alignItems="center">
              <Image w={6} src={bscscanLogo} />
              <Text>BscScan</Text>
            </Button>
          </Link>
        </Flex>
      </Flex>
      <Flex flexDir="column">
        <Text mb={4} fontSize="2xl">
          Frenchie Farm Contract:
        </Text>
        <Flex
          gridGap={4}
          alignItems="center"
          bg="gray.900"
          p={4}
          borderRadius={4}
          boxShadow="md"
          w="fit-content"
        >
          <Box>{constants.farmAddress}</Box>
          <Link href={constants.bscScanLinkFarm} target="_blank">
            <Button d="flex" gridGap={3} alignItems="center">
              <Image w={6} src={bscscanLogo} />
              <Text>BscScan</Text>
            </Button>
          </Link>
        </Flex>
      </Flex>

      <Title mt={6} mb={4} isSecondary>
        The BEP-20 Token
      </Title>
      <Text>
        Frenchie goes by the ticker FREN
        <br />
        Is a simple BEP-20 smart contract with burn function, secured and
        audited by professionals.
        <br />
        Doing it simple, it’s also automatically secure. That is what we had in
        mind when we deployed it as we plan for our future blockchain. A simple
        contract is what is needed to not over-complicate at mainnet launch.
      </Text>
      <Text>
        In order to deliver more advanced features, we deploy other separate
        contracts to deliver farming, governance, etc.
        <br />
        This give us more decentralization, security and confidence about our
        ecosystem.
      </Text>
      <Text mb={3}>Every contract is 100% open source and public.</Text>
      <Link
        href="https://github.com/FrenchieNetwork/contract"
        target="_blank"
        color={constants.colors.white}
        fontWeight="bold"
      >
        <Button leftIcon={<FaGithub />}>Source Code</Button>
      </Link>

      <Title mt={6} mb={4} isSecondary>
        Rewards
      </Title>
      <Text mb={4}>
        In order to reward our holders, we have a rewarding system to liquidity
        providers. If you are already a liquidity provider, you can stake your
        LP tokens in our{' '}
        <Link
          fontWeight="bold"
          color={constants.colors.red}
          href="/farming"
          onClick={goTo('/farming')}
        >
          farming page
        </Link>{' '}
        and earn rewards every day! Also, you can easilly become a liquidity
        provider. It’s easy, you can access our{' '}
        <Link
          fontWeight="bold"
          color={constants.colors.red}
          href="https://app.1inch.io/#/56/dao/pools/0xe01245e737fcc14ba053ecfe6d10eda070b5a8f9/governance"
          target="_blank"
        >
          1inch liquidity pool
        </Link>{' '}
        and will be able to deposit a certain amount of tokens (BNB+FREN) to
        collaborate with our liquidity. You will receive back an amount of LP
        tokens and will passively earn a certain quantity of FREN from the 1inch
        swap fees.
      </Text>
      <Link
        onClick={goTo('/farming')}
        target="_blank"
        color={constants.colors.white}
        fontWeight="bold"
      >
        <Button leftIcon={<FaTractor />}>Farming Page</Button>
      </Link>
    </Container>
  );
}
