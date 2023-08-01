import { Flex, Text } from '@chakra-ui/react';
import { KeyColour } from '../KeyColour';

type PnlTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

export const PnlTooltip = ({ payload }: PnlTooltipProps) => {
  const tradesInfo = payload?.[0]?.payload as any;

  if (!tradesInfo) {
    return null;
  }

  const totalTrades = tradesInfo.amt;
  const cumulativeTrades = tradesInfo.cumulativeTrades;

  return (
    <Flex
      flexDirection="column"
      bg="navy.900"
      padding={4}
      minWidth="190px"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.900"
    >
      <Text mb={2} fontFamily="heading" color="gray.500" fontSize="12px" lineHeight="16px">
        {tradesInfo.name}
      </Text>
      <Flex mt={2} justifyContent="space-between" w="100%">
        <KeyColour label="Daily Fee" colour="whiteAlpha.400" />
        <Text ml={3} fontFamily="heading" fontSize="12px" lineHeight="16px" textAlign="center">
          {totalTrades}
        </Text>
      </Flex>
      <Flex mt={2} justifyContent="space-between" w="100%">
        <KeyColour label="Stakers" colour="cyan.400" />
        <Text ml={3} fontFamily="heading" fontSize="12px" lineHeight="16px" textAlign="center">
          {tradesInfo.uv}
        </Text>
      </Flex>
      <Flex mt={2} justifyContent="space-between" w="100%">
        <KeyColour label="Loss" colour="pink.300" />
        <Text ml={3} fontFamily="heading" fontSize="12px" lineHeight="16px" textAlign="center">
          {tradesInfo.amt}
        </Text>
      </Flex>
      <Flex mt={2} justifyContent="space-between" w="100%">
        <KeyColour label="Profit" colour="teal.300" />
        <Text ml={3} fontFamily="heading" fontSize="12px" lineHeight="16px" textAlign="center">
          {tradesInfo.cnt}
        </Text>
      </Flex>
    </Flex>
  );
};
