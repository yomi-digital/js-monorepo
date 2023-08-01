import { useState } from 'react';
import { Box, Flex, Text, FlexProps } from '@chakra-ui/react';
import { TimeBadge } from '../../TimeBadge';
import { KeyColour } from '../KeyColour';
import { OITooltips } from './OITooltips';
import {
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
  ReferenceLine,
  BarChart,
} from 'recharts';

export const OpenInterests = ({ ...props }: FlexProps) => {
  const data = [
    {
      name: 'Jan',
      uv: 590,
      pv: -800,
      amt: 1400,
      cnt: 490,
    },
    {
      name: 'Feb',
      uv: 868,
      pv: -967,
      amt: 1506,
      cnt: 590,
    },
    {
      name: 'Mar',
      uv: 1397,
      pv: -1098,
      amt: 989,
      cnt: 350,
    },
    {
      name: 'Apr',
      uv: 1480,
      pv: -1200,
      amt: 1228,
      cnt: 480,
    },
    {
      name: 'May',
      uv: 1520,
      pv: -1108,
      amt: 1100,
      cnt: 460,
    },
    {
      name: 'Jun',
      uv: 1400,
      pv: -680,
      amt: 1700,
      cnt: 380,
    },
    {
      name: 'Jul',
      uv: 1400,
      pv: -680,
      amt: 1700,
      cnt: 380,
    },
    {
      name: 'Aug',
      uv: 400,
      pv: -680,
      amt: 1900,
      cnt: 680,
    },
    {
      name: 'Sep',
      uv: 1900,
      pv: -1680,
      amt: 700,
      cnt: 180,
    },
    {
      name: 'Oct',
      uv: 1400,
      pv: -680,
      amt: 1700,
      cnt: 380,
    },
    {
      name: 'Nov',
      uv: 900,
      pv: -1280,
      amt: 800,
      cnt: 380,
    },
    {
      name: 'Dec',
      uv: 1000,
      pv: -680,
      amt: 1700,
      cnt: 380,
    },
  ];

  const [state, setState] = useState<'M' | 'Y'>('M');

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
            Open Interests
          </Text>
          <Box>
            <TimeBadge title="1M" onPress={() => setState('M')} isActive={state === 'M'} />
            <TimeBadge title="1Y" onPress={() => setState('Y')} isActive={state === 'Y'} />
          </Box>
        </Flex>
        <Flex mt={6}>
          <KeyColour label="LONG" colour="whiteAlpha.400" />
          <KeyColour ml={4} label="SHORT" colour="pink.300" />
        </Flex>

        <>
          <Text my={3} color="white" fontSize="24px" fontFamily="heading" fontWeight={800}>
            27814.665675859185
          </Text>
          <ResponsiveContainer minWidth="100%" minHeight={200}>
            <BarChart
              data={data}
              stackOffset="sign"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid stroke="0" />
              <XAxis
                dataKey="name"
                tickLine={{ display: 'none' }}
                tick={{ fontSize: '12px', fontFamily: 'Inter', fill: '#9999AC' }}
              />
              <Tooltip content={OITooltips} cursor={false} wrapperStyle={{ outline: 'none' }} />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="pv" fill="#F471FF" stackId="stack" />
              <Bar dataKey="uv" fill="#464657" stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </>
      </Flex>
    </>
  );
};
