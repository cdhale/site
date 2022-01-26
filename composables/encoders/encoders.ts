import { BigNumber } from '@ethersproject/bignumber'
import { defaultAbiCoder } from '@ethersproject/abi'
import contractAddresses from '~/constant/contractAddresses'

export const IncentiveKey = `tuple(address rewardToken,address pool,uint256 startTime,uint256 endTime,address refundee)`

export const getTuple = (network) => {
  return {
    rewardToken: contractAddresses[network.id].lordsTokenAddress,
    pool: contractAddresses[network.id].lordsPool,
    startTime: 1640679356,
    endTime: 1643312097,
    refundee: contractAddresses[network.id].treasury,
  }
}

export const getV2Tuple = (network) => {
  return {
    rewardToken: contractAddresses[network.id].lordsTokenAddress,
    pool: contractAddresses[network.id].lordsPool,
    startTime: 1643250739,
    endTime: 1648434739,
    refundee: contractAddresses[network.id].treasury,
  }
}

export const EncodedIncentiveKey = (network) => {
  return defaultAbiCoder.encode([IncentiveKey], [getTuple(network)])
}

export const V2EncodedIncentiveKey = (network) => {
  return defaultAbiCoder.encode([IncentiveKey], [getV2Tuple(network)])
}
