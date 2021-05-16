import { useQuery, UseQueryOptions } from 'react-query';
import { BigNumberish, ethers } from 'ethers';

import QUERY_KEYS from '../../queryKeys';
import { CRYPTO_CURRENCY_MAP, CurrencyKey, iStandardSynth, synthToAsset } from '../../currency';
import { QueryContext } from '../../context';

export type Rates = Record<CurrencyKey, number>;

type CurrencyRate = BigNumberish;
type SynthRatesTuple = [string[], CurrencyRate[]];

// Additional commonly used currencies to fetch, besides the one returned by the SynthUtil.synthsRates
const additionalCurrencies = [CRYPTO_CURRENCY_MAP.SNX].map(ethers.utils.formatBytes32String);

const useExchangeRatesQuery = (ctx: QueryContext, options?: UseQueryOptions<Rates>) => {
	return useQuery<Rates>(
		QUERY_KEYS.Rates.ExchangeRates,
		async () => {
			const exchangeRates: Rates = {};

			const [synthsRates, ratesForCurrencies] = (await Promise.all([
				ctx.snxjs.contracts.SynthUtil.synthsRates(),
				ctx.snxjs.contracts.ExchangeRates.ratesForCurrencies(additionalCurrencies),
			])) as [SynthRatesTuple, CurrencyRate[]];

			const synths = [...synthsRates[0], ...additionalCurrencies] as string[];
			const rates = [...synthsRates[1], ...ratesForCurrencies] as CurrencyRate[];

			synths.forEach((currencyKeyBytes32: CurrencyKey, idx: number) => {
				const currencyKey = ethers.utils.parseBytes32String(currencyKeyBytes32);
				const rate = Number(ethers.utils.formatEther(rates[idx]));

				exchangeRates[currencyKey] = rate;
				// only interested in the standard synths (sETH -> ETH, etc)
				if (iStandardSynth(currencyKey)) {
					exchangeRates[synthToAsset(currencyKey)] = rate;
				}
			});

			return exchangeRates;
		},
		{
			...options,
		}
	);
};

export default useExchangeRatesQuery;
