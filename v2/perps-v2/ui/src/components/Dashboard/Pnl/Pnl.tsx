import { useState } from 'react';
import { Box, Flex, Text, FlexProps, Spinner } from '@chakra-ui/react';
import { TimeBadge } from '../../TimeBadge';
import { KeyColour } from '../KeyColour';
import { PnlTooltip } from './PnlTooltip';
import UsePnlStats from '../../../hooks/usePnlStats';
import { DUNE_API_KEY } from '../../../utils/constants';

import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from 'recharts';

export const Pnl = ({ ...props }: FlexProps) => {
  const [state, setState] = useState<'M' | 'Y'>('M');

  const { data, error, loading, totalDailyFee } = UsePnlStats(DUNE_API_KEY);
  console.log('data', data);
  console.log('error', error);
  console.log('loading', loading);

  return (
    <>
      <Flex
        width="49%"
        my={5}
        borderColor="gray.900"
        borderWidth="1px"
        borderRadius="5px"
        sx={{
          borderCollapse: 'separate !important',
          borderSpacing: 0,
        }}
        bg="navy.700"
        flexDirection="column"
        p={4}
        {...props}
      >
        <Flex justifyContent="space-between" flexDir="row" w="100%">
          <Text fontFamily="heading" fontSize="20px" fontWeight={700} lineHeight="28px">
            Pnl
          </Text>
          <Box>
            <TimeBadge title="1M" onPress={() => setState('M')} isActive={state === 'M'} />
            <TimeBadge title="1Y" onPress={() => setState('Y')} isActive={state === 'Y'} />
          </Box>
        </Flex>
        <Flex mt={6}>
          <KeyColour label="STAKERS" colour="whiteAlpha.400" />
          <KeyColour ml={4} label="DAILY FEE" colour="cyan.500" />
          <KeyColour ml={4} label="LOSS" colour="pink.300" />
          <KeyColour ml={4} label="PROFIT" colour="teal.300" />
        </Flex>
        {loading ? (
          <Flex justifyContent="center" alignItems="center" height="100%" minHeight={200}>
            <Spinner size="xl" />
          </Flex>
        ) : (
          <>
            <Text my={3} color="white" fontSize="24px" fontFamily="heading" fontWeight={800}>
              $
              {totalDailyFee.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>

            {data && (
              <ResponsiveContainer minWidth="100%" minHeight={200}>
                <ComposedChart
                  width={500}
                  height={400}
                  data={data.result.rows}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke="0" />
                  <XAxis
                    dataKey="dayFormatted"
                    tickLine={{ display: 'none' }}
                    tick={{ fontSize: '12px', fontFamily: 'Inter', fill: '#9999AC' }}
                  />
                  <YAxis hide={true} />
                  <Tooltip content={PnlTooltip} cursor={false} wrapperStyle={{ outline: 'none' }} />
                  <Area type="monotone" dataKey="total_pnl" fill="#464657" stroke="0" />
                  <Bar dataKey="loss" barSize={22} fill="#F471FF" />
                  <Line type="monotone" dataKey="profit" stroke="#4FD1C5" dot={false} />
                  <Line
                    type="monotone"
                    dataKey="daily_fee"
                    stroke="#00D1FF"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </Flex>
    </>
  );
};
