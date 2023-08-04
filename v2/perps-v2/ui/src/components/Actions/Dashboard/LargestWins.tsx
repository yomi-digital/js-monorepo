import React, { useState } from 'react';
import { TableContainer, Table, Thead, Tr, Tbody, Flex, Text, Box } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { POSITIONS_QUERY_MARKET } from '../../../queries/positions';
import { Market, PnL, TableHeaderCell, WalletTooltip, EntryExit } from '../../Shared';
import { FuturesPosition_OrderBy, OrderDirection } from '../../../__generated__/graphql';
import { getUnixTime, subDays } from 'date-fns';
import { wei } from '@synthetixio/wei';
import { SmallTableLoading } from './SmallTableLoading';
import { TimeBadge } from '../../TimeBadge';

type FilterOptions = {
  [key: string]: number;
};

const filterOptions: FilterOptions = {
  day: 1,
  week: 7,
  month: 30,
};

export const LargestWins = () => {
  const [selectedFilter, setSelectedFilter] = useState('day');

  const { data, loading, error } = useQuery(POSITIONS_QUERY_MARKET, {
    variables: {
      where: {
        closeTimestamp_gte: `${getUnixTime(subDays(new Date(), filterOptions[selectedFilter]))}`,
        isOpen: false,
      },
      orderBy: FuturesPosition_OrderBy.RealizedPnl,
      orderDirection: OrderDirection.Desc,
      first: 3,
    },
    pollInterval: 10000,
  });

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
        <Flex py={4} px={6} justifyContent="space-between" flexDir="row" w="100%">
          <Text fontFamily="heading" fontSize="20px" fontWeight={700} lineHeight="28px">
            Largest Wins of the <span>{selectedFilter}</span>
          </Text>
          <Box>
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
          </Box>
        </Flex>

        <Table bg="navy.700">
          <Thead>
            <Tr>
              <TableHeaderCell>Market</TableHeaderCell>
              <TableHeaderCell>
                <Flex flexDirection="column">
                  <Text>Entry Price</Text>
                  <Text>Exit Price</Text>
                </Flex>
              </TableHeaderCell>
              <TableHeaderCell>Realised PnL</TableHeaderCell>
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
            {data?.futuresPositions.map((item) => {
              const {
                id,
                trader,
                market: { asset },
                leverage,
                entryPrice,
                realizedPnl,
                exitPrice,
                long,
              } = item;

              return (
                <Tr key={id} borderTopWidth="1px">
                  <Market
                    asset={asset}
                    leverage={wei(leverage, 18, true).toNumber()}
                    direction={long ? 'LONG' : 'SHORT'}
                  />
                  <EntryExit
                    entry={wei(entryPrice, 18, true).toNumber()}
                    exit={wei(exitPrice, 18, true).toNumber()}
                  />
                  <PnL pnl={wei(realizedPnl, 18, true).toNumber()} />
                  <WalletTooltip address={trader.id} />
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        {(!loading && data?.futuresPositions.length === 0) ||
          (error && (
            <Flex width="100%" justifyContent="center" bg="navy.700" borderTopWidth="1px">
              <Text fontFamily="inter" fontWeight="500" fontSize="14px" color="gray.500" m={6}>
                No results
              </Text>
            </Flex>
          ))}
      </TableContainer>
    </>
  );
};
