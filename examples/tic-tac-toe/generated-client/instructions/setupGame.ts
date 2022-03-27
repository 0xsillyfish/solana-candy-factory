import { PublicKey, TransactionInstruction } from "@solana/web3.js"
import BN from "bn.js"
import * as borsh from "@project-serum/borsh"
import * as types from "../types"
import { PROGRAM_ID } from "../programId"

export interface SetupGameArgs {
  playerTwo: PublicKey
}

export interface SetupGameAccounts {
  game: PublicKey
  playerOne: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.publicKey("playerTwo")])

export function setupGame(args: SetupGameArgs, accounts: SetupGameAccounts) {
  const keys = [
    { pubkey: accounts.game, isSigner: true, isWritable: true },
    { pubkey: accounts.playerOne, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([180, 218, 128, 75, 58, 222, 35, 82])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      playerTwo: args.playerTwo,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
