import { PublicKey, Connection } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface TraderRiskGroupFields {
  tag: types.AccountTag
  marketProductGroup: PublicKey
  owner: PublicKey
  activeProducts: Array<number>
  totalDeposited: types.FractionalFields
  totalWithdrawn: types.FractionalFields
  cashBalance: types.FractionalFields
  pendingCashBalance: types.FractionalFields
  pendingFees: types.FractionalFields
  validUntil: BN
  makerFeeBps: number
  takerFeeBps: number
  traderPositions: Array<types.TraderPositionFields>
  riskStateAccount: PublicKey
  feeStateAccount: PublicKey
  clientOrderId: BN
  openOrders: types.OpenOrdersFields
}

export interface TraderRiskGroupJSON {
  tag: types.AccountTagJSON
  marketProductGroup: string
  owner: string
  activeProducts: Array<number>
  totalDeposited: types.FractionalJSON
  totalWithdrawn: types.FractionalJSON
  cashBalance: types.FractionalJSON
  pendingCashBalance: types.FractionalJSON
  pendingFees: types.FractionalJSON
  validUntil: string
  makerFeeBps: number
  takerFeeBps: number
  traderPositions: Array<types.TraderPositionJSON>
  riskStateAccount: string
  feeStateAccount: string
  clientOrderId: string
  openOrders: types.OpenOrdersJSON
}

export class TraderRiskGroup {
  readonly tag: types.AccountTag
  readonly marketProductGroup: PublicKey
  readonly owner: PublicKey
  readonly activeProducts: Array<number>
  readonly totalDeposited: types.Fractional
  readonly totalWithdrawn: types.Fractional
  readonly cashBalance: types.Fractional
  readonly pendingCashBalance: types.Fractional
  readonly pendingFees: types.Fractional
  readonly validUntil: BN
  readonly makerFeeBps: number
  readonly takerFeeBps: number
  readonly traderPositions: Array<types.TraderPosition>
  readonly riskStateAccount: PublicKey
  readonly feeStateAccount: PublicKey
  readonly clientOrderId: BN
  readonly openOrders: types.OpenOrders

  static readonly discriminator = Buffer.from([121, 228, 110, 56, 254, 207, 245, 168])

  static readonly layout = borsh.struct([
    types.AccountTag.layout('tag'),
    borsh.publicKey('marketProductGroup'),
    borsh.publicKey('owner'),
    borsh.array(borsh.u8(), 128, 'activeProducts'),
    types.Fractional.layout('totalDeposited'),
    types.Fractional.layout('totalWithdrawn'),
    types.Fractional.layout('cashBalance'),
    types.Fractional.layout('pendingCashBalance'),
    types.Fractional.layout('pendingFees'),
    borsh.i64('validUntil'),
    borsh.i32('makerFeeBps'),
    borsh.i32('takerFeeBps'),
    borsh.array(types.TraderPosition.layout(), 16, 'traderPositions'),
    borsh.publicKey('riskStateAccount'),
    borsh.publicKey('feeStateAccount'),
    borsh.u128('clientOrderId'),
    types.OpenOrders.layout('openOrders')
  ])

  constructor(fields: TraderRiskGroupFields) {
    this.tag = fields.tag
    this.marketProductGroup = fields.marketProductGroup
    this.owner = fields.owner
    this.activeProducts = fields.activeProducts
    this.totalDeposited = new types.Fractional({ ...fields.totalDeposited })
    this.totalWithdrawn = new types.Fractional({ ...fields.totalWithdrawn })
    this.cashBalance = new types.Fractional({ ...fields.cashBalance })
    this.pendingCashBalance = new types.Fractional({
      ...fields.pendingCashBalance
    })
    this.pendingFees = new types.Fractional({ ...fields.pendingFees })
    this.validUntil = fields.validUntil
    this.makerFeeBps = fields.makerFeeBps
    this.takerFeeBps = fields.takerFeeBps
    this.traderPositions = fields.traderPositions.map((item) => new types.TraderPosition({ ...item }))
    this.riskStateAccount = fields.riskStateAccount
    this.feeStateAccount = fields.feeStateAccount
    this.clientOrderId = fields.clientOrderId
    this.openOrders = new types.OpenOrders({ ...fields.openOrders })
  }

  static async fetch(c: Connection, address: PublicKey): Promise<TraderRiskGroup | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(c: Connection, addresses: PublicKey[]): Promise<Array<TraderRiskGroup | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): TraderRiskGroup {
    if (!data.slice(0, 8).equals(TraderRiskGroup.discriminator)) {
      throw new Error('invalid account discriminator')
    }

    const dec = TraderRiskGroup.layout.decode(data.slice(8))

    return new TraderRiskGroup({
      tag: types.AccountTag.fromDecoded(dec.tag),
      marketProductGroup: dec.marketProductGroup,
      owner: dec.owner,
      activeProducts: dec.activeProducts,
      totalDeposited: types.Fractional.fromDecoded(dec.totalDeposited),
      totalWithdrawn: types.Fractional.fromDecoded(dec.totalWithdrawn),
      cashBalance: types.Fractional.fromDecoded(dec.cashBalance),
      pendingCashBalance: types.Fractional.fromDecoded(dec.pendingCashBalance),
      pendingFees: types.Fractional.fromDecoded(dec.pendingFees),
      validUntil: dec.validUntil,
      makerFeeBps: dec.makerFeeBps,
      takerFeeBps: dec.takerFeeBps,
      traderPositions: dec.traderPositions.map(
        (item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
          types.TraderPosition.fromDecoded(item)
      ),
      riskStateAccount: dec.riskStateAccount,
      feeStateAccount: dec.feeStateAccount,
      clientOrderId: dec.clientOrderId,
      openOrders: types.OpenOrders.fromDecoded(dec.openOrders)
    })
  }

  toJSON(): TraderRiskGroupJSON {
    return {
      tag: this.tag.toJSON(),
      marketProductGroup: this.marketProductGroup.toString(),
      owner: this.owner.toString(),
      activeProducts: this.activeProducts,
      totalDeposited: this.totalDeposited.toJSON(),
      totalWithdrawn: this.totalWithdrawn.toJSON(),
      cashBalance: this.cashBalance.toJSON(),
      pendingCashBalance: this.pendingCashBalance.toJSON(),
      pendingFees: this.pendingFees.toJSON(),
      validUntil: this.validUntil.toString(),
      makerFeeBps: this.makerFeeBps,
      takerFeeBps: this.takerFeeBps,
      traderPositions: this.traderPositions.map((item) => item.toJSON()),
      riskStateAccount: this.riskStateAccount.toString(),
      feeStateAccount: this.feeStateAccount.toString(),
      clientOrderId: this.clientOrderId.toString(),
      openOrders: this.openOrders.toJSON()
    }
  }

  static fromJSON(obj: TraderRiskGroupJSON): TraderRiskGroup {
    return new TraderRiskGroup({
      tag: types.AccountTag.fromJSON(obj.tag),
      marketProductGroup: new PublicKey(obj.marketProductGroup),
      owner: new PublicKey(obj.owner),
      activeProducts: obj.activeProducts,
      totalDeposited: types.Fractional.fromJSON(obj.totalDeposited),
      totalWithdrawn: types.Fractional.fromJSON(obj.totalWithdrawn),
      cashBalance: types.Fractional.fromJSON(obj.cashBalance),
      pendingCashBalance: types.Fractional.fromJSON(obj.pendingCashBalance),
      pendingFees: types.Fractional.fromJSON(obj.pendingFees),
      validUntil: new BN(obj.validUntil),
      makerFeeBps: obj.makerFeeBps,
      takerFeeBps: obj.takerFeeBps,
      traderPositions: obj.traderPositions.map((item) => types.TraderPosition.fromJSON(item)),
      riskStateAccount: new PublicKey(obj.riskStateAccount),
      feeStateAccount: new PublicKey(obj.feeStateAccount),
      clientOrderId: new BN(obj.clientOrderId),
      openOrders: types.OpenOrders.fromJSON(obj.openOrders)
    })
  }
}