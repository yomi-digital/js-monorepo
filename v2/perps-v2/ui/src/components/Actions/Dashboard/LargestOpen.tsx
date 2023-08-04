import { TableContainer, Table, Thead, Tr, Tbody, Flex, Text, Box } from '@chakra-ui/react';
import { Currency, Market, Size, TableHeaderCell, WalletTooltip } from '../../Shared';
import { wei } from '@synthetixio/wei';
import { SmallTableLoading } from './SmallTableLoading';
import { DataInterface, useLargestOpenPosition } from '../../../hooks';
import { TimeBadge } from '../../TimeBadge';
import { useState } from 'react';

export const LargestOpen = () => {
  const [selectedFilter, setSelectedFilter] = useState<'day' | 'week' | 'month'>('day');
  const { loading, data, error } = useLargestOpenPosition(selectedFilter);
  return (
    <>
      <TableContainer
        width="100%"
        my={5}
        borderColor="gray.900"
        borderWidth="1px"
        borderRadius="5px"
        sx={{
          borderCollapse: 'separate !important',
          borderSpacing: 0,
        }}
        bg="navy.700"
      >
        <>
          <Flex py={4} px={6} justifyContent="space-between" flexDir="row" w="100%">
            <Text fontFamily="heading" fontSize="20px" fontWeight={700} lineHeight="28px">
              Largest open positions
            </Text>
            {/* <Box>
              <TimeBadge
                title="D"
                onPress={() => setSelectedFilter('day')}
                isActive={selectedFilter === 'day'}
              />
              <TimeBadge
                title="W"
                onPress={() => setSelectedFilter('week')}
                isActive={selectedFilter === 'week'}
              />
              <TimeBadge
                title="M"
                onPress={() => setSelectedFilter('month')}
                isActive={selectedFilter === 'month'}
              />
            </Box> */}
          </Flex>

          <Table bg="navy.700">
            <Thead>
              <Tr>
                <TableHeaderCell>Market</TableHeaderCell>
                <TableHeaderCell>
                  <Text>Size</Text>
                  <Text>&nbsp;</Text>
                </TableHeaderCell>
                <TableHeaderCell>Entry Price</TableHeaderCell>
              </Tr>
            </Thead>
            <Tbody>
              {loading && (
                <>
                  <SmallTableLoading />
                  <SmallTableLoading />
                  <SmallTableLoading />
                </>
              )}
              {data?.map((item: DataInterface) => {
                const {
                  id,
                  trader,
                  market: { asset },
                  pythItem: { price },
                  leverage,
                  long,
                  size,
                  entryPrice,
                } = item;

                return (
                  <Tr key={id} borderTopWidth="1px">
                    <Market
                      asset={asset}
                      leverage={wei(leverage, 18, true).toNumber()}
                      direction={long ? 'LONG' : 'SHORT'}
                    />
                    <Size
                      size={wei(size, 18, true).toNumber()}
                      marketPrice={wei(price, 8, true).toNumber()}
                    />
                    <Currency amount={wei(entryPrice, 18, true).toNumber()} />
                    <WalletTooltip address={trader.id} />
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          {(!loading && data?.length === 0) ||
            (error && (
              <Flex width="100%" justifyContent="center" bg="navy.700" borderTopWidth="1px">
                <Text fontFamily="inter" fontWeight="500" fontSize="14px" color="gray.500" m={6}>
                  No results
                </Text>
              </Flex>
            ))}
        </>
      </TableContainer>
    </>
  );
};
