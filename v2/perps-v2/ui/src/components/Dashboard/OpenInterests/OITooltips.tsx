import { Flex, Text } from '@chakra-ui/react';
import { KeyColour } from '../KeyColour';

type OITooltipsProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

export const OITooltips = ({ payload }: OITooltipsProps) => {
  const tradesInfo = payload?.[0]?.payload as any;

  if (!tradesInfo) {
    return null;
  }

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
        <KeyColour label="Long" colour="whiteAlpha.400" />
        <Text ml={3} fontFamily="heading" fontSize="12px" lineHeight="16px" textAlign="center">
          {tradesInfo.uv}
        </Text>
      </Flex>
      <Flex mt={2} justifyContent="space-between" w="100%">
        <KeyColour label="Short" colour="pink.300" />
        <Text ml={3} fontFamily="heading" fontSize="12px" lineHeight="16px" textAlign="center">
          {tradesInfo.pv}
        </Text>
      </Flex>
    </Flex>
  );
};
