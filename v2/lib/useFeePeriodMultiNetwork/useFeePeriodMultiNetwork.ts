import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { providers } from 'ethers';
import { ContractContext } from '@snx-v2/ContractContext';
import { getFeePool } from '@snx-v2/useSynthetixContracts';
import { NetworkIdByName } from '@synthetixio/contracts-interface';

export const useFeePeriodMultiNetwork = (period = 1 /* Defaults to previous period*/) => {
  const { walletAddress, networkId } = useContext(ContractContext);
  return useQuery({
    queryKey: ['stakingV2', 'useFeePeriodMultiNetwork', networkId, walletAddress],
    queryFn: async () => {
      const optimismProvider = new providers.InfuraProvider(
        NetworkIdByName['mainnet-ovm'],
        process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
      );
      const mainnetProvider = new providers.InfuraProvider(
        NetworkIdByName.mainnet,
        process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
      );
      const [FeePoolOptimism, FeePoolMainnet] = await Promise.all([
        getFeePool({
          provider: optimismProvider,
          networkId: NetworkIdByName['mainnet-ovm'],
          signer: null,
        }),
        getFeePool({
          provider: mainnetProvider,
          networkId: NetworkIdByName.mainnet,
          signer: null,
        }),
      ]);

      const [feePeriodOptimism, feePeriodMainnet] = await Promise.all([
        FeePoolOptimism.recentFeePeriods(period),
        FeePoolMainnet.recentFeePeriods(period),
      ]);
      return { feePeriodOptimism: feePeriodOptimism, feePeriodMainnet };
    },

    enabled: true,
    staleTime: 1000,
  });
};
