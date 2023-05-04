import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme, useColorMode } from '@chakra-ui/react';
import { Fonts, theme as snxTheme } from '@synthetixio/v3-theme';
import { DEFAULT_QUERY_REFRESH_INTERVAL, DEFAULT_QUERY_STALE_TIME } from '@snx-v3/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GasSpeedProvider } from '@snx-v3/useGasSpeed';
import { BlockchainProvider } from '@snx-v3/useBlockchain';
import { Router } from './Router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
      staleTime: DEFAULT_QUERY_STALE_TIME,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = extendTheme(snxTheme, {
  styles: {
    global: {
      body: {
        bg: 'black',
        backgroundImage: 'none',
      },
    },
  },
});

export const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === 'light') {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Fonts />
        <BlockchainProvider>
          <GasSpeedProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </GasSpeedProvider>
          <ReactQueryDevtools />
        </BlockchainProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};