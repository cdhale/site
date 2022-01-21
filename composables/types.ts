export type RarityLevel = 1 | 2 | 3 | 4 | 5 | 6

export type ColorFnParameters = {
  color: string
  itemName?: string
  level: RarityLevel
}

export type ColorFn = (
  params: ColorFnParameters
) => string | void | null | false

export type Realm = {
  id: string
  tokenId: number
  currentOwner: string
  minted: number
  name: string
  cities: number
  harbours: number
  rivers: number
  regions: number
  resourceIds: [number]
  resources: []
  wonder: number
  rarityScore: number
  rarityRank: number
  order: string
  bridgedOwner: string
}

export type Wallet = {
  realmsHeld: number
  bridgedRealmsHeld: number
}
