import { BigNumber } from 'ethers';
import { chains } from './constants';

export type CollateralType = {
  address: string;
  symbol: string;
  logoURI: string;
  decimals: number;
  targetCRatio?: BigNumber;
  minimumCRatio?: BigNumber;
  price?: BigNumber;
  priceDecimals?: number;
};

export type ChainName = keyof typeof chains;

export type StakingPositionType = {
  id: string;
  fundId: string;
  fundName: string;
  collateralAmount: BigNumber;
  collateralType: CollateralType;
  cRatio: BigNumber;
};
