import { gql } from 'graphql-request'
import { WalletFragment } from './fragments/wallet'
import { RealmFragment, SRealmFragment } from './fragments/realmFragments'
import { RaidResultFragment } from './fragments/raidResults'
import { BagFragment, defaultLoot } from './fragments/loot'
import { ManaFragment } from './fragments/mana'
import { GAdventurerFragment } from './fragments/gadventurer'

const getRealms = gql`
  query usersRealms($address: String) {
    realms(first: 100, where: { currentOwner: $address }) {
      id
      tokenURI
      currentOwner {
        address
        joined
      }
    }
    bridgedRealms: realms(where: { bridgedOwner: $address }) {
      id
    }
    wallet(id: $address) {
      realmsHeld
      bridgedRealmsHeld
    }
  }
`

const getResourceListQuery = gql`
  query getResourceListQuery {
    resources(first: 25) {
      id
      name
      stakedRealms
      totalRealms
    }
  }
`
const getResourceBalancesQuery = gql`
  query getResourceBalancesQuery($address: String) {
    accounts(where: { id: $address }) {
      balances {
        token {
          identifier
        }
        value
      }
    }
  }
`

const getl1Adventurer = gql`
  ${WalletFragment}
  ${RealmFragment}
  ${BagFragment}
  ${defaultLoot}
  ${ManaFragment}
  ${GAdventurerFragment}

  query getAdventurer($address: String!) {
    wallet(id: $address) {
      id
      realmsHeld
      bridgedRealmsHeld
      bridgedRealms(first: 30) {
        ...RealmData
      }
      realms(first: 30) {
        ...RealmData
      }
      bagsHeld
      bags(first: 30) {
        ...BagData
      }
      mLootsHeld
      mLoot(first: 30) {
        id
        head
        neck
        chest
        hand
        ring
        weapon
        waist
        foot
      }
      manasHeld
      manas(first: 30) {
        ...ManaData
      }
      gAdventurersHeld
      gAdventurers(first: 30) {
        ...DefaultBagData
        ...GAdventurerData
      }
    }
  }
`
const getl2Adventurer = gql`
  ${RealmFragment}
  ${SRealmFragment}
  ${RaidResultFragment}
  query adventurer($address: String!) {
    wallet(id: $address) {
      id
      realmsHeld
      realms(first: 5) {
        ...RealmData
      }
      srealmsHeld
      srealms(first: 3) {
        ...SRealmData
      }
      raiderResults(orderBy: timestamp, orderDirection: desc) {
        ...RaidResultFragment
      }
      defenderResults(orderBy: timestamp, orderDirection: desc) {
        ...RaidResultFragment
      }
    }
  }
`

const mintedRealmsQuery = gql`
  query mintedRealmsQuery($lastID: String) {
    realms(
      first: 1000
      where: { id_gt: $lastID }
      orderBy: id
      orderDirection: asc
    ) {
      id
    }
  }
`
const lastOutboxEntryQuery = gql`
  query lastOutboxEntry {
    outboxEntries(orderBy: outboxEntryIndex, orderDirection: desc, first: 1) {
      outboxEntryIndex
    }
  }
`
const getWithdrawalsQuery = gql`
  query getWithdrawalsQuery($sender: String, $fromBlock: Int, $toBlock: Int) {
    withdrawals(
      where: {
        from: $sender
        l2BlockNum_gte: $fromBlock
        l2BlockNum_lt: $toBlock
      }
      orderBy: l2BlockNum
      orderDirection: desc
    ) {
      l2ToL1Event {
        id
        caller
        destination
        batchNumber
        indexInBatch
        arbBlockNum
        ethBlockNum
        timestamp
        callvalue
        data
      }
      realmId
    }
  }
`
const messageHasExecutedQuery = gql`
  query messageHasExecutedQuery(
    $path: Int
    batchHexString: String
  ) {
    outboxOutputs(where: {path: $path, outboxEntry: $batchHexString, spent:true }) {
      id,
    }
  }
`

const lpPositionQuery = gql`
  query lpPositionQuery($address: String) {
    positions(where: { owner: $address }) {
      id
      tokenId
      owner
      staked
      oldOwner
      incentivePotisions {
        id
        active
      }
    }
  }
`

export {
  getRealms,
  mintedRealmsQuery,
  getl1Adventurer,
  getl2Adventurer,
  lastOutboxEntryQuery,
  getWithdrawalsQuery,
  messageHasExecutedQuery,
  getResourceListQuery,
  getResourceBalancesQuery,
  lpPositionQuery,
}
