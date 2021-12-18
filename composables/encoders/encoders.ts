import { BigNumber } from '@ethersproject/bignumber'
import { defaultAbiCoder } from '@ethersproject/abi'

export const IncentiveKey = `tuple(
    address rewardToken,
    address pool,
    uint256 startTime;
    uint256 endTime;
    address refundee;
  )`

export const EncodedIncentiveKey = () => {
  return defaultAbiCoder.encode(
    ['bytes', IncentiveKey],
    [
      '0x6781dbb93c6bac8b91be1c6e3c99dfd98a7b5b88',
      '0x32daf96f9e40ac7f0e2ccc7bd8f2eac47d3cb985',
      1639766563,
      1640630563,
      '0xF3a8b033c2572A2887c507aa92eD134B29620245',
    ]
  )
}
