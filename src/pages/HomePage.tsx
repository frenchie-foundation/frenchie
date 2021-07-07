import React, { useCallback, useEffect } from 'react';
import { Container, HStack, Link } from '@chakra-ui/layout';
import {
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Image,
  Flex,
  Text,
  Input,
  useClipboard,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

import { FaNewspaper, FaTelegram, FaExchangeAlt, FaBug, FaBirthdayCake, FaMedium, FaTwitter, FaBook } from 'react-icons/fa';
import openInNewTab from '../helpers/openInNewTab';
import constants from '../config/constants';
import Title from '../components/Title';
import latokenlogo from '../assets/images/latoken.png';
import frenchiefarm from '../assets/images/frenchie-farm.png';
import frenchie from '../assets/images/logo.svg';
import frenchieblockchain from '../assets/images/frenchie-blockchain.png';
import { useHistory } from 'react-router';

export default function HomePage(): React.ReactElement {
  useEffect(() => {
    document.title = 'Frenchie Network';
  }, []);

  const history = useHistory();

  const handleTelegramLinkClick = useCallback(() => {
    openInNewTab(constants.telegramGroupLink);
  }, []);

  const handle1inchLinkClick = useCallback(() => {
    openInNewTab(constants.oneInchSwapLink);
  }, []);
  const handlepcsv1LinkClick = useCallback(() => {
    openInNewTab(constants.pancakeSwapLink);
  }, []);
  const handleTwitterClick = useCallback(() => {
    openInNewTab(constants.twitterGroupLink);
  }, []);
  const handleMediumClick = useCallback(() => {
    openInNewTab(constants.mediumGroupLink);
  }, []);
  const handleDocumentationClick = useCallback(() => {
    openInNewTab(constants.gitbookGroupLink);
  }, []);
  const handleWhitepaperLinkClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openInNewTab('/frenchie-whitepaper.pdf');
  }, []);

  const handleAuditLinkClick = useCallback((e?: any) => {
    if (e) {
      e.preventDefault();
    }
    openInNewTab('/audit-report.pdf');
  }, []);
  const { hasCopied, onCopy } = useClipboard(constants.tokenAddress);
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
      <Box mt={16} mb={16}>
        <Title lineHeight="48px" isPageTitle>
          More Than A Meme
        </Title>
        <Title isPageTitle color={constants.colors.red}>
          <span style={{ color: constants.colors.green }}>An Eco</span> Smart
          Chain
        </Title>
      </Box>
      <Box
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'lg'}
        display={{ base: 'block', md: 'flex' }}
        alignItems="start"
        padding={4}
      >
        <Box p={4} w="100%">
          <Flex justifyContent="center" mb={4}>
            <Image src={frenchie} boxSize="75px" />
          </Flex>
          <Title mb={4} textAlign="center">
            Frenchie Network
          </Title>
          <Text>
            <Text display="inline" color={constants.colors.red}>
            Frenchie Network {' '}
            </Text>
            will be a high-performance, scalable, and secure smart-contract platform.
            <br />
It is designed to overcome the limitations of previous generation blockchain platforms.
<br />
Frenchie Network will be permission-less, decentralized, and open-source.
<br /><br />
 Frenchie Network will use a superior consensus mechanism called Asynchronous Byzantine Fault Tolerance (aBFT). 
<br /><br />
Network Testnet Estimated by Q4 2021.
          </Text>
        </Box>
        <Box p={4} w="100%" mt={{ base: 10, md: 0 }}>
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
            that provide liquidity on 1inch Aggregated D.E.X on FREN/BNB pair. We redistribute currently over 25 billion FREN from our Marketing Funds into our farming pool.
            <br /><br />
            We consider it a smart way to reward our investors that wait for our Blockchain technology launch and progress. Once that happen they will be able to swap their BEP-20 FREN tokens to FREN native coin.

          </Text>
        </Box>
        <Box p={4} w="100%" mt={{ base: 10, md: 0 }}>
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
            <br /><br />
            Our  consensus mechanism Asynchronous Byzantine Fault Tolerance will be the highest standard among all consensus algorithms.
            <br /><br />
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
      <HStack justifyContent="center" spacing={2} mt={8} mb={4}>
      <Button
          colorScheme="green"
          leftIcon={<FaExchangeAlt />}
          onClick={handle1inchLinkClick}
        >
          Buy on 1Inch
        </Button>
        <Button
          colorScheme="orange"
          leftIcon={<FaBirthdayCake />}
          onClick={handlepcsv1LinkClick}
        >
          Buy on PancakeSwap V1
        </Button>
        <Button
          colorScheme="red"
          leftIcon={<FaBug />}
          onClick={handleAuditLinkClick}
        >
          Audit
        </Button>
      </HStack>
      <HStack justifyContent="center" spacing={2}>
        <Button
          colorScheme="telegram"
          leftIcon={<FaTelegram />}
          onClick={handleTelegramLinkClick}
        >
          Telegram
        </Button>
        <Button
          colorScheme="twitter"
          leftIcon={<FaTwitter />}
          onClick={handleTwitterClick}
        >
          Twitter
        </Button>
        <Button
          colorScheme="facebook"
          leftIcon={<FaMedium />}
          onClick={handleMediumClick}
        >
          Medium
        </Button>
        <Button
          colorScheme="purple"
          leftIcon={<FaBook />}
          onClick={handleDocumentationClick}
        >
          Documentation
        </Button>
        <Button
          colorScheme="gray"
          leftIcon={<FaNewspaper />}
          onClick={handleWhitepaperLinkClick}
        >
          Whitepaper
        </Button>
      </HStack>
      <Flex justifyContent="center">
        <HStack
          mt={14}
          spacing={8}
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <a
            href={constants.coinmarketcapGroupLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack spacing={4}>
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
          </a>
          <a
            href={constants.coingeckoGroupLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack spacing={4}>
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
          </a>
          <a
            href={constants.latokenGroupLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack spacing={4}>
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
          </a>
          
          <a
            href={constants.dextoolsGroupLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack spacing={4}>
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
          </a>
          <a
            href={constants.poocoinGroupLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack spacing={4}>
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
          </a>
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
      <SimpleGrid
        align={'center'}
        columns={{ base: 1, md: 5 }}
        spacing={{ base: 5, lg: 8 }}
      >
        <Stat
          textAlign={'center'}
          px={{ base: 2, md: 4 }}
          py={'1'}
          shadow={'xl'}
          border={'1px solid'}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          rounded={'lg'}
        >
          <Flex justifyContent={'space-between'}>
            <Box maxW="7xl" mx={'auto'} pt={2} px={{ base: 2, sm: 12, md: 17 }}>
              <StatLabel fontWeight={'medium'} isTruncated>
                Initial Supply
              </StatLabel>
              <StatNumber fontSize={'l'} fontWeight={'medium'}>
                1,000,000,000,000
              </StatNumber>
            </Box>
          </Flex>
        </Stat>
        <Stat
          textAlign={'center'}
          px={{ base: 2, md: 4 }}
          py={'1'}
          shadow={'xl'}
          border={'1px solid'}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          rounded={'lg'}
        >
          <Flex justifyContent={'space-between'}>
            <Box maxW="7xl" mx={'auto'} pt={2} px={{ base: 2, sm: 12, md: 17 }}>
              <StatLabel fontWeight={'medium'} isTruncated>
                Current Supply
              </StatLabel>
              <StatNumber fontSize={'l'} fontWeight={'medium'}>
                750,000,000,000
              </StatNumber>
            </Box>
          </Flex>
        </Stat>
        <Stat
          textAlign={'center'}
          px={{ base: 2, md: 4 }}
          py={1}
          pb={3}
          shadow={'xl'}
          border={'1px solid'}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          rounded={'lg'}
        >
          <Flex justifyContent={'space-between'}>
            <Box maxW="7xl" mx={'auto'} pt={2} px={{ base: 2, sm: 12, md: 17 }}>
              <StatLabel fontWeight={'medium'} isTruncated>
                Burned Supply
              </StatLabel>
              <StatNumber fontSize={'l'} fontWeight={'medium'}>
                250,000,000,000
              </StatNumber>
            </Box>
          </Flex>
        </Stat>
        <Stat
          textAlign={'center'}
          px={{ base: 2, md: 4 }}
          py={1}
          pb={3}
          shadow={'xl'}
          border={'1px solid'}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          rounded={'lg'}
        >
          <Flex justifyContent={'space-between'}>
            <Box maxW="7xl" mx={'auto'} pt={2} px={{ base: 2, sm: 12, md: 17 }}>
              <StatLabel fontWeight={'medium'} isTruncated>
                Liquidity Locked PCSv1
              </StatLabel>
              <StatNumber fontSize={'l'} fontWeight={'medium'}>
                250,000,000,000
              </StatNumber>
            </Box>
          </Flex>
        </Stat>
        <Stat
          textAlign={'center'}
          px={{ base: 2, md: 4 }}
          py={1}
          pb={3}
          shadow={'xl'}
          border={'1px solid'}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          rounded={'lg'}
        >
          <Flex justifyContent={'space-between'}>
            <Box maxW="7xl" mx={'auto'} pt={2} px={{ base: 2, sm: 12, md: 17 }}>
              <StatLabel fontWeight={'medium'} isTruncated>
                Marketing + DEV
              </StatLabel>
              <StatNumber fontSize={'l'} fontWeight={'medium'}>
                300,000,000,000
              </StatNumber>
            </Box>
          </Flex>
        </Stat>
      </SimpleGrid>
      <Title
        textAlign={'center'}
        fontSize={'4xl'}
        py={2}
        mt={8}
        mb={4}
        fontWeight={'bold'}
      >
        Contracts
      </Title>
      <Text textAlign={'center'}>
        <b>Frenchie Contract:</b>{' '}
        <Input maxW="xl" value={constants.tokenAddress} isReadOnly />
        <Button onClick={onCopy} ml={2}>
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
        <Link href={constants.bscScanLink} target="_blank">
          <Button mt={6} mb={6} ml={4}>
            <Image
              w={120}
              src={
                'https://bscscan.com/images/brandassets/BscScan-logo-light.png'
              }
            />
          </Button>
        </Link>
      </Text>

      <Text textAlign={'center'}>
        <b>Frenchie Farm Contract:</b>{' '}
        <Input maxW="xl" value={constants.farmAddress} isReadOnly />
        <Button onClick={onCopy} ml={2}>
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
        <Link href={constants.bscScanLinkFarm} target="_blank">
          <Button mt={6} mb={6} ml={4}>
            <Image
              w={120}
              src={
                'https://bscscan.com/images/brandassets/BscScan-logo-light.png'
              }
            />
          </Button>
        </Link>
      </Text>

      <Title mt={6} mb={4} isSecondary>
        The token
      </Title>
      <Text>
        Frenchie goes by the ticker FREN and is a simple BEP-20 smart contract
        with burn function, secured and audited by professionals. Doing it
        simple, it’s also automatically secure. That is what we had in mind when
        we deployed it.
      </Text>
      <Text>
        In order to deliver more advanced features, we deploy other separate
        contracts to deliver farming, governance, etc. This give us more
        decentralization, security and confidence about our ecosystem.
      </Text>
      <Text>
        By the way, every contract is 100% open source and public. To find the
        source code,{' '}
        <Link
          href="https://github.com/FrenchieNetwork/contract"
          target="_blank"
          color={constants.colors.red}
          fontWeight="bold"
        >
          click here
        </Link>
        .
      </Text>

      <Title mt={6} mb={4} isSecondary>
        Rewards
      </Title>
      <Text>
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

      <Title mt={6} mb={4} isSecondary>
        Whitepaper
      </Title>
      <Text>
        If you want to know more about the development and purposes of the
        Frenchie Network, you can{' '}
        <Link
          fontWeight="bold"
          color={constants.colors.red}
          href="/whitepaper.pdf"
          target="_blank"
          onClick={handleWhitepaperLinkClick}
        >
          access our whitepaper
        </Link>
        .
      </Text>
    </Container>
  );
}
