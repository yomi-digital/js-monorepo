import {
  PoolCreated,
  PoolNameUpdated,
  PoolOwnershipAccepted,
  PoolConfigurationSet,
  PoolNominationRenounced,
  PoolNominationRevoked,
  PoolOwnerNominated,
} from '../generated/PoolModule/PoolModule';
import {
  MarketRegistered,
  MarketManagerModule,
  MarketUsdDeposited,
  MarketUsdWithdrawn,
} from '../generated/MarketManagerModule/MarketManagerModule';
import { Deposited, Withdrawn } from '../generated/CollateralModule/CollateralModule';
import { CollateralConfigured } from '../generated/CollateralConfigurationModule/CollateralConfigurationModule';
import {
  AccountCreated,
  PermissionGranted,
  PermissionRevoked,
} from '../generated/AccountModule/AccountModule';
import {
  RewardsClaimed as RewardsClaimedEvent,
  RewardsDistributed,
  RewardsDistributorRegistered,
} from '../generated/RewardsManagerModule/RewardsManagerModule';
import { Liquidation, VaultLiquidation } from '../generated/LiquidationModule/LiquidationModule';
import { DelegationUpdated, VaultModule } from '../generated/VaultModule/VaultModule';
import { UsdMinted, UsdBurned } from '../generated/IssueUSDModule/IssueUSDModule';
import {
  Pool,
  Market,
  CollateralType,
  Account,
  AccountPermissionUsers,
  Vault,
  Position,
  MarketConfiguration,
  RewardsDistribution,
  AccountRewardsDistributor,
  RewardsClaimed,
  RewardsDistributor,
  Liquidation as LiquidationEntity,
  VaultLiquidation as VaultLiquidationEntity,
} from '../generated/schema';
import { BigDecimal, BigInt, Bytes, store } from '@graphprotocol/graph-ts';

////////////////////
// Event handlers //
////////////////////

///////////
// Pool //
//////////

export function handlePoolCreated(event: PoolCreated): void {
  const newPool = new Pool(event.params.poolId.toString());
  newPool.owner = event.params.owner;
  newPool.created_at = event.block.timestamp;
  newPool.created_at_block = event.block.number;
  newPool.updated_at = event.block.timestamp;
  newPool.updated_at_block = event.block.number;
  newPool.save();
}

export function handlePoolOwnerNominated(event: PoolOwnerNominated): void {
  const pool = Pool.load(event.params.poolId.toString());
  if (pool !== null) {
    pool.nominated_owner = event.params.nominatedOwner;
    pool.updated_at = event.block.timestamp;
    pool.updated_at_block = event.block.number;
    pool.save();
  }
}

export function handlePoolNominationRenounced(event: PoolNominationRenounced): void {
  const pool = Pool.load(event.params.poolId.toString());
  if (pool !== null) {
    pool.nominated_owner = Bytes.empty();
    pool.updated_at = event.block.timestamp;
    pool.updated_at_block = event.block.number;
    pool.save();
  }
}

export function handlePoolNominationRevoked(event: PoolNominationRevoked): void {
  const pool = Pool.load(event.params.poolId.toString());
  if (pool !== null) {
    pool.nominated_owner = Bytes.empty();
    pool.updated_at = event.block.timestamp;
    pool.updated_at_block = event.block.number;
    pool.save();
  }
}

export function handlePoolNameUpdated(event: PoolNameUpdated): void {
  const pool = Pool.load(event.params.poolId.toString());
  if (pool !== null) {
    pool.name = event.params.name.toString();
    pool.updated_at_block = event.block.number;
    pool.updated_at = event.block.timestamp;
    pool.save();
  }
}

export function handleNewPoolOwner(event: PoolOwnershipAccepted): void {
  const pool = Pool.load(event.params.poolId.toString());
  if (pool !== null) {
    pool.updated_at_block = event.block.number;
    pool.updated_at = event.block.timestamp;
    pool.owner = event.params.owner;
    pool.nominated_owner = Bytes.empty();
    pool.save();
  }
}

/////////////
// Market //
////////////

export function handleMarketCreated(event: MarketRegistered): void {
  const newMarket = new Market(event.params.marketId.toString());
  newMarket.address = event.params.market;
  newMarket.created_at = event.block.timestamp;
  newMarket.created_at_block = event.block.number;
  newMarket.updated_at = event.block.timestamp;
  newMarket.updated_at_block = event.block.number;
  newMarket.save();
}

export function handlePoolConfigurationSet(event: PoolConfigurationSet): void {
  const pool = Pool.load(event.params.poolId.toString());
  // Pool will be never undefined, though for safety reasons we are checking for that
  if (pool !== null) {
    // Creating a temporarily variable for figuring out which MarketConfiguration entity to delete
    const oldPoolMarketConfigurationState = new Map<string, string[]>();
    if (pool.configurations !== null) {
      oldPoolMarketConfigurationState.set(pool.id, pool.configurations!);
    }
    // Creating a temporarily variable for the pool.total_weight key
    const totalWeight: BigInt[] = [];
    // Reset the state because the new configuration from the event is the only source of truth
    pool.configurations = [];
    for (let i = 0; i < event.params.markets.length; ++i) {
      const market = Market.load(event.params.markets.at(i).marketId.toString());
      if (market) {
        let marketConfiguration = MarketConfiguration.load(pool.id.concat('-').concat(market.id));
        if (marketConfiguration === null) {
          marketConfiguration = new MarketConfiguration(pool.id.concat('-').concat(market.id));
          marketConfiguration.created_at = event.block.timestamp;
          marketConfiguration.created_at_block = event.block.number;
        }
        marketConfiguration.weight = event.params.markets.at(i).weightD18;
        marketConfiguration.market = market.id;
        marketConfiguration.pool = event.params.poolId.toString();
        marketConfiguration.max_debt_share_value = event.params.markets
          .at(i)
          .maxDebtShareValueD18.toBigDecimal();
        marketConfiguration.updated_at = event.block.timestamp;
        marketConfiguration.updated_at_block = event.block.number;
        // If the market doesn't have configurations array, create an array with the current configurations id
        if (market.configurations === null) {
          market.configurations = [marketConfiguration.id];
          // Otherwise check if this configuration id is not included, if so, add it
        } else if (!market.configurations!.includes(marketConfiguration.id)) {
          // Set the new state to the current one, to add up the previously added entities
          const newState = market.configurations!;
          newState.push(marketConfiguration.id);
          market.configurations = newState;
        }
        // Same as for the market, if empty initialize it
        if (pool.configurations === null) {
          pool.configurations = [marketConfiguration.id];
        } else if (!pool.configurations!.includes(marketConfiguration.id)) {
          // Set the new state to the current one, to add up the previously added entities
          const newState = pool.configurations!;
          newState.push(marketConfiguration.id);
          pool.configurations = newState;
        }
        // If the new MarketConfiguration is not part of the old state, remove it from the store
        if (oldPoolMarketConfigurationState.has(pool.id)) {
          const oldMarketConfigs = oldPoolMarketConfigurationState.get(pool.id);
          for (let j = 0; j < oldMarketConfigs.length; ++j) {
            const currentOldState = oldPoolMarketConfigurationState.get(pool.id).at(j);
            if (!pool.configurations!.includes(currentOldState)) {
              store.remove('MarketConfiguration', currentOldState);
            }
          }
        }
        totalWeight.push(event.params.markets.at(i).weightD18);
        market.updated_at = event.block.timestamp;
        market.updated_at_block = event.block.number;
        market.save();
        marketConfiguration.save();
      }
    }
    pool.total_weight = totalWeight.reduce((prev, next) => {
      prev = prev.plus(next);
      return prev;
    }, BigInt.fromU64(0));
    pool.updated_at = event.block.timestamp;
    pool.updated_at_block = event.block.number;
    pool.save();
  }
}

export function handleMarketUsdDeposited(event: MarketUsdDeposited): void {
  const market = Market.load(event.params.marketId.toString());
  if (market !== null) {
    const contract = MarketManagerModule.bind(event.address);
    market.reported_debt = contract.getMarketReportedDebt(event.params.marketId).toBigDecimal();
    if (market.usd_deposited === null) {
      market.usd_deposited = event.params.amount.toBigDecimal();
    } else {
      market.usd_deposited = market.usd_deposited!.plus(event.params.amount.toBigDecimal());
    }
    market.updated_at = event.block.timestamp;
    market.updated_at_block = event.block.number;
    if (!market.net_issuance) {
      market.net_issuance = BigDecimal.fromString('0');
    }
    market.net_issuance = market.net_issuance!.minus(event.params.amount.toBigDecimal());
    market.save();
  }
}

export function handleMarketUsdWithdrawn(event: MarketUsdWithdrawn): void {
  const market = Market.load(event.params.marketId.toString());
  if (market !== null) {
    const contract = MarketManagerModule.bind(event.address);
    market.reported_debt = contract.getMarketReportedDebt(event.params.marketId).toBigDecimal();
    if (market.usd_withdrawn === null) {
      market.usd_withdrawn = event.params.amount.toBigDecimal();
    } else {
      market.usd_withdrawn = market.usd_withdrawn!.plus(event.params.amount.toBigDecimal());
    }
    market.usd_withdrawn = event.params.amount.toBigDecimal();
    market.updated_at = event.block.timestamp;
    market.updated_at_block = event.block.number;
    if (!market.net_issuance) {
      market.net_issuance = BigDecimal.fromString('0');
    }
    market.net_issuance = changetype<BigDecimal>(market.net_issuance).plus(
      event.params.amount.toBigDecimal()
    );
    market.save();
  }
}

//////////////
// Account //
/////////////

export function handleAccountCreated(event: AccountCreated): void {
  const account = new Account(event.params.accountId.toString());
  account.owner = event.params.sender;
  account.created_at = event.block.timestamp;
  account.created_at_block = event.block.number;
  account.updated_at = event.block.timestamp;
  account.updated_at_block = event.block.number;
  account.permissions = [];
  account.save();
}

/////////////////
// Collateral //
////////////////

export function handleCollateralConfigured(event: CollateralConfigured): void {
  let collateralType = CollateralType.load(event.params.collateralType.toHex());
  if (collateralType === null) {
    collateralType = new CollateralType(event.params.collateralType.toHex());
    collateralType.created_at = event.block.timestamp;
    collateralType.created_at_block = event.block.number;
  }
  collateralType.oracle_node_id = BigInt.fromSignedBytes(event.params.config.oracleNodeId);
  collateralType.liquidation_reward = event.params.config.liquidationRewardD18.toBigDecimal();
  collateralType.liquidation_ratio = event.params.config.liquidationRatioD18.toBigDecimal();
  collateralType.depositing_enabled = event.params.config.depositingEnabled;
  collateralType.issuance_ratio = event.params.config.issuanceRatioD18.toBigDecimal();
  collateralType.min_delegation = event.params.config.minDelegationD18.toBigDecimal();
  collateralType.updated_at = event.block.timestamp;
  collateralType.updated_at_block = event.block.number;
  collateralType.save();
}

export function handleDeposited(event: Deposited): void {
  let collateralType = CollateralType.load(event.params.collateralType.toHex());
  if (collateralType) {
    collateralType.updated_at = event.block.timestamp;
    collateralType.updated_at_block = event.block.number;
    if (collateralType.total_amount_deposited !== null) {
      // @dev we could also account for every account how much they deposited and withdrawn
      collateralType.total_amount_deposited = collateralType.total_amount_deposited!.plus(
        event.params.tokenAmount.toBigDecimal()
      );
    } else {
      collateralType.total_amount_deposited = event.params.tokenAmount.toBigDecimal();
    }
    collateralType.save();
  }
}

export function handleWithdrawn(event: Withdrawn): void {
  let collateralType = CollateralType.load(event.params.collateralType.toHex());
  if (collateralType) {
    collateralType.updated_at = event.block.timestamp;
    collateralType.updated_at_block = event.block.number;
    if (collateralType.total_amount_deposited !== null) {
      // @dev we could also account for every account how much they deposited and withdrawn
      collateralType.total_amount_deposited = collateralType.total_amount_deposited!.minus(
        event.params.tokenAmount.toBigDecimal()
      );
    }
    collateralType.save();
  }
}

/////////////////
// Permission //
////////////////

export function handlePermissionGranted(event: PermissionGranted): void {
  const account = Account.load(event.params.accountId.toString());
  if (account !== null) {
    let accountPermissionUsers = AccountPermissionUsers.load(
      event.params.accountId.toString().concat('-').concat(event.params.user.toHex())
    );
    if (accountPermissionUsers === null) {
      accountPermissionUsers = new AccountPermissionUsers(
        event.params.accountId.toString().concat('-').concat(event.params.user.toHex())
      );
      accountPermissionUsers.created_at = event.block.timestamp;
      accountPermissionUsers.created_at_block = event.block.number;
      accountPermissionUsers.permissions = [event.params.permission];
    } else {
      const newState = accountPermissionUsers.permissions;
      newState.push(event.params.permission);
      accountPermissionUsers.permissions = newState;
    }
    accountPermissionUsers.updated_at = event.block.timestamp;
    accountPermissionUsers.updated_at_block = event.block.number;
    accountPermissionUsers.address = event.params.user;
    accountPermissionUsers.account = account.id;
    if (account.permissions === null) {
      account.permissions = [accountPermissionUsers.id];
    } else if (!account.permissions!.includes(accountPermissionUsers.id)) {
      const newState = account.permissions!;
      newState.push(accountPermissionUsers.id);
      account.permissions = newState;
    }
    account.updated_at = event.block.timestamp;
    account.updated_at_block = event.block.number;
    accountPermissionUsers.save();
    account.save();
  }
}

export function handlePermissionRevoked(event: PermissionRevoked): void {
  const account = Account.load(event.params.accountId.toString());
  const permissions = AccountPermissionUsers.load(
    event.params.accountId.toString().concat('-').concat(event.params.user.toHex())
  );
  if (account !== null && permissions !== null) {
    const newState: Bytes[] = [];
    for (let i = 0; i < permissions.permissions.length; ++i) {
      if (permissions.permissions.at(i) !== event.params.permission) {
        newState.push(permissions.permissions.at(i));
      }
    }
    // If newState is empty, we know that all the permissions have been revoked and we can
    // remove the entity from the store
    if (newState.length === 0) {
      store.remove(
        'AccountPermissionUsers',
        event.params.accountId.toString().concat('-').concat(event.params.user.toHex())
      );
      const newAccountIdsState: string[] = [];
      for (let i = 0; i < account.permissions!.length; ++i) {
        if (
          account.permissions!.at(i) !==
          event.params.accountId.toString().concat('-').concat(event.params.user.toHex())
        ) {
          newAccountIdsState.push(
            event.params.accountId.toString().concat('-').concat(event.params.user.toHex())
          );
        }
      }
      account.permissions = newAccountIdsState;
    } else {
      permissions.permissions = newState;
    }
    permissions.updated_at = event.block.timestamp;
    permissions.updated_at_block = event.block.number;
    account.updated_at = event.block.timestamp;
    account.updated_at_block = event.block.number;
    account.save();
    permissions.save();
  }
}

///////////////////////
// Position + Vault //
//////////////////////

export function handleDelegationUpdated(event: DelegationUpdated): void {
  const id = event.params.accountId
    .toString()
    .concat('-')
    .concat(event.params.poolId.toString())
    .concat('-')
    .concat(event.params.collateralType.toHex());
  let position = Position.load(id);
  if (position === null) {
    position = new Position(id);
    position.created_at = event.block.timestamp;
    position.created_at_block = event.block.number;
    position.account = event.params.accountId.toString();
    position.collateral_amount = event.params.amount.toBigDecimal();
  }
  const collateralAmountChange = position.collateral_amount.minus(
    event.params.amount.toBigDecimal()
  );
  position.pool = event.params.poolId.toString();
  position.collateral_type = event.params.collateralType.toHex();
  position.collateral_amount = event.params.amount.toBigDecimal();
  position.updated_at = event.block.timestamp;
  position.updated_at_block = event.block.number;
  // position.c_ratio = VaultModule.bind(event.address)
  //   .getPositionCollateralizationRatio(
  //     event.params.accountId,
  //     event.params.poolId,
  //     event.params.collateralType
  //   )
  //   .toBigDecimal();
  position.leverage = event.params.leverage.toBigDecimal();
  let vault = Vault.load(
    event.params.poolId.toString().concat('-').concat(event.params.collateralType.toHex())
  );
  if (vault === null) {
    vault = new Vault(
      event.params.poolId.toString().concat('-').concat(event.params.collateralType.toHex())
    );
    vault.created_at = event.block.timestamp;
    vault.created_at_block = event.block.number;
    vault.collateral_amount = event.params.amount.toBigDecimal();
    vault.collateral_type = event.params.collateralType.toHex();
    vault.pool = event.params.poolId.toString();
  } else {
    vault.collateral_amount = vault.collateral_amount.plus(collateralAmountChange);
  }
  vault.updated_at = event.block.timestamp;
  vault.updated_at_block = event.block.number;
  vault.save();
  position.save();
}

export function handleUSDMinted(event: UsdMinted): void {
  const position = Position.load(
    event.params.accountId
      .toString()
      .concat('-')
      .concat(
        event.params.poolId.toString().concat('-').concat(event.params.collateralType.toHex())
      )
  );
  if (position !== null) {
    position.updated_at = event.block.timestamp;
    position.updated_at_block = event.block.number;
    if (position.total_minted !== null) {
      position.total_minted = position.total_minted!.plus(event.params.amount.toBigDecimal());
    } else {
      position.total_minted = event.params.amount.toBigDecimal();
    }
    if (position.net_issuance !== null) {
      position.net_issuance = position.net_issuance!.plus(event.params.amount.toBigDecimal());
    } else {
      position.net_issuance = event.params.amount.toBigDecimal();
    }
    position.save();
  }
}

export function handleUSDBurned(event: UsdBurned): void {
  const position = Position.load(
    event.params.accountId
      .toString()
      .concat(
        '-'.concat(
          event.params.poolId.toString().concat('-').concat(event.params.collateralType.toHex())
        )
      )
  );
  if (position !== null) {
    if (position.total_burned !== null) {
      position.total_burned = position.total_burned!.plus(event.params.amount.toBigDecimal());
    } else {
      position.total_burned = event.params.amount.toBigDecimal();
    }
    if (position.net_issuance !== null) {
      position.net_issuance = position.net_issuance!.plus(event.params.amount.toBigDecimal());
    } else {
      position.net_issuance = event.params.amount.toBigDecimal();
    }
    position.updated_at = event.block.timestamp;
    position.updated_at_block = event.block.number;
    position.save();
  }
}

//////////////
// Rewards //
/////////////

export function handleRewardsDistributorRegistered(event: RewardsDistributorRegistered): void {
  const distributor = new RewardsDistributor(event.params.distributor.toHex());
  distributor.created_at = event.block.timestamp;
  distributor.created_at_block = event.block.number;
  distributor.updated_at = event.block.number;
  distributor.updated_at_block = event.block.timestamp;
  distributor.total_claimed = BigDecimal.fromString('0');
  distributor.total_distributed = BigDecimal.fromString('0');
  distributor.save();
}

export function handleRewardsDistributed(event: RewardsDistributed): void {
  const rewardsDistribution = new RewardsDistribution(
    event.params.distributor
      .toHex()
      .concat('-')
      .concat(event.block.timestamp.toString())
      .concat('-')
      .concat(event.logIndex.toString())
  );
  let accountRewardsDistributor = AccountRewardsDistributor.load(
    event.params.poolId
      .toString()
      .concat('-')
      .concat(event.params.collateralType.toHex())
      .concat('-')
      .concat(event.params.distributor.toHex())
  );
  let rewardsDistributor = RewardsDistributor.load(event.params.distributor.toHex());
  if (rewardsDistributor !== null) {
    rewardsDistributor.total_distributed = rewardsDistributor.total_distributed.plus(
      event.params.amount.toBigDecimal()
    );
    rewardsDistributor.updated_at = event.block.timestamp;
    rewardsDistributor.updated_at_block = event.block.number;
    rewardsDistributor.save();
  }
  if (accountRewardsDistributor === null) {
    accountRewardsDistributor = new AccountRewardsDistributor(
      event.params.poolId
        .toString()
        .concat('-')
        .concat(event.params.collateralType.toHex())
        .concat('-')
        .concat(event.params.distributor.toHex())
    );
    accountRewardsDistributor.created_at = event.block.timestamp;
    accountRewardsDistributor.created_at_block = event.block.number;
  }
  accountRewardsDistributor.distributor = event.params.distributor.toHex();
  accountRewardsDistributor.updated_at = event.block.timestamp;
  accountRewardsDistributor.updated_at_block = event.block.number;
  rewardsDistribution.distributor = event.params.distributor.toHex();
  rewardsDistribution.pool = event.params.poolId.toString();
  rewardsDistribution.collateral_type = event.params.collateralType;
  rewardsDistribution.amount = event.params.amount.toBigDecimal();
  rewardsDistribution.start = event.params.start;
  rewardsDistribution.duration = event.params.duration;
  rewardsDistribution.created_at = event.block.timestamp;
  rewardsDistribution.created_at_block = event.block.number;
  rewardsDistribution.updated_at = event.block.timestamp;
  rewardsDistribution.updated_at_block = event.block.number;
  accountRewardsDistributor.save();
  rewardsDistribution.save();
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  const accountRewardsDistributor = AccountRewardsDistributor.load(
    event.params.poolId
      .toString()
      .concat('-')
      .concat(event.params.collateralType.toHex())
      .concat('-')
      .concat(event.params.distributor.toHex())
  );
  const rewardsClaimed = new RewardsClaimed(
    event.params.distributor
      .toHex()
      .concat('-')
      .concat(event.block.timestamp.toString())
      .concat('-')
      .concat(event.logIndex.toString())
  );
  let rewardsDistributor = RewardsDistributor.load(event.params.distributor.toHex());
  if (rewardsDistributor !== null) {
    rewardsDistributor.total_claimed = rewardsDistributor.total_claimed.plus(
      event.params.amount.toBigDecimal()
    );
    rewardsDistributor.updated_at = event.block.timestamp;
    rewardsDistributor.updated_at_block = event.block.number;
    rewardsDistributor.save();
  }
  if (accountRewardsDistributor !== null) {
    if (accountRewardsDistributor.total_claimed !== null) {
      accountRewardsDistributor.total_claimed = accountRewardsDistributor.total_claimed!.plus(
        event.params.amount.toBigDecimal()
      );
    } else {
      accountRewardsDistributor.total_claimed = event.params.amount.toBigDecimal();
    }
    accountRewardsDistributor.updated_at = event.block.timestamp;
    accountRewardsDistributor.updated_at_block = event.block.number;
    accountRewardsDistributor.distributor = event.params.distributor.toHex();
    accountRewardsDistributor.save();
  }
  rewardsClaimed.distributor = event.params.distributor.toHex();
  rewardsClaimed.created_at = event.block.timestamp;
  rewardsClaimed.created_at_block = event.block.number;
  rewardsClaimed.account = event.params.accountId.toString();
  rewardsClaimed.pool = event.params.poolId.toString();
  rewardsClaimed.collateral_type = event.params.collateralType;
  rewardsClaimed.amount = event.params.amount.toBigDecimal();
  rewardsClaimed.updated_at = event.block.timestamp;
  rewardsClaimed.updated_at_block = event.block.number;
  rewardsClaimed.save();
}

//////////////////
// Liquidation //
/////////////////

export function handleLiquidation(event: Liquidation): void {
  const newLiquidation = new LiquidationEntity(
    event.params.accountId
      .toString()
      .concat('-')
      .concat(event.params.poolId.toString())
      .concat('-')
      .concat(event.params.collateralType.toHex())
      .concat('-')
      .concat(event.logIndex.toString())
  );
  newLiquidation.created_at = event.block.timestamp;
  newLiquidation.created_at_block = event.block.number;
  newLiquidation.updated_at = event.block.timestamp;
  newLiquidation.updated_at_block = event.block.number;
  newLiquidation.account = event.params.accountId.toString();
  newLiquidation.pool = event.params.poolId.toString();
  newLiquidation.collateral_type = event.params.collateralType;
  newLiquidation.debt_liquidated = event.params.liquidationData.debtLiquidated.toBigDecimal();
  newLiquidation.collateral_liquidated =
    event.params.liquidationData.collateralLiquidated.toBigDecimal();
  newLiquidation.amount_rewarded = event.params.liquidationData.amountRewarded.toBigDecimal();
  newLiquidation.sender = event.params.sender;
  newLiquidation.liquidate_as_account_id = event.params.liquidateAsAccountId.toString();
  newLiquidation.save();
}

export function handleVaultLiquidation(event: VaultLiquidation): void {
  const newVaultLiquidation = new VaultLiquidationEntity(
    event.params.poolId
      .toString()
      .concat('-')
      .concat(event.params.collateralType.toHex())
      .concat('-')
      .concat(event.logIndex.toString())
  );
  newVaultLiquidation.created_at = event.block.timestamp;
  newVaultLiquidation.created_at_block = event.block.number;
  newVaultLiquidation.updated_at = event.block.timestamp;
  newVaultLiquidation.updated_at_block = event.block.number;
  newVaultLiquidation.pool = event.params.poolId.toString();
  newVaultLiquidation.collateral_type = event.params.collateralType;
  newVaultLiquidation.amount_rewarded = event.params.liquidationData.amountRewarded.toBigDecimal();
  newVaultLiquidation.amount_liquidated =
    event.params.liquidationData.debtLiquidated.toBigDecimal();
  newVaultLiquidation.collateral_liquidated =
    event.params.liquidationData.collateralLiquidated.toBigDecimal();
  newVaultLiquidation.amount_rewarded = event.params.liquidationData.amountRewarded.toBigDecimal();
  newVaultLiquidation.liquidate_as_account_id = event.params.liquidateAsAccountId.toString();
  newVaultLiquidation.sender = event.params.sender;
  newVaultLiquidation.save();
}