import * as generated from '../generated/ERC721/ERC721'
import * as lab from "../generated/ERC1155/ERC1155"
import * as manager from "../generated/Closet/Closet"
import * as profile from "../generated/Profile/Profile"
import { Owner, Transfer, Token, Profile } from "../generated/schema"
import { handleLabItemTransfer, _createNewOwner } from "./common"
import { ONE_BI, ZERO_BI, _createTransactionIfNotExist } from './helpers'


export function handleTransferSingle(event: lab.TransferSingle): void {
  const params = event.params

  handleLabItemTransfer(params.from, params.to, params.id, params.amount, event)
}

export function handleTransferBatch(event: lab.TransferBatch): void {
  const params = event.params

  for (let index = 0; index < params.ids.length; index++) {
    const id = params.ids[index]
    const amount = params.amounts[index]
    handleLabItemTransfer(params.from, params.to, id, amount, event)
  }
}


export function handleSetItems(event: manager.Set): void {
  const params = event.params

  
  const token = Token.load(params.token.toHex())

  if (token) {

    for (let index = 0; index < params.deposits.length; index++) {
      const id = params.deposits[index].toHex()
      const items = token.labItems
      items.push(id)

      token.labItems = items
    }

    for (let index = 0; index < params.whithdraws.length; index++) {
      const id = params.whithdraws[index].toHex()
      const items = token.labItems

      const removeIdx = items.indexOf(id)
      items.splice(removeIdx, 1)

      token.labItems = items
    }

    token.save()
  }

}


export function handleSetMain(event: profile.SetMain): void {
  const params = event.params
  const assigner = params.assigner.toHex()
  const tokenId = params.tokenId.toHex()
  let profileDto = Profile.load(assigner)
  const owner = Owner.load(assigner)!

  if (profileDto === null) {
    profileDto = new Profile(assigner)
    profileDto.owner = assigner
    profileDto.timestamp = event.block.timestamp
    owner.profile = assigner
  }

  profileDto.token = tokenId

  profileDto.save()
  owner.save()
}

export function handleSetUsername(event: profile.SetUsername): void {
  const params = event.params
  const assigner = params.assigner.toHex()
  const username = params.username
  let profileDto = Profile.load(assigner)
  const owner = Owner.load(assigner)!

  if (profileDto === null) {
    profileDto = new Profile(assigner)
    profileDto.owner = assigner
    owner.profile = assigner
  }

  profileDto.name = username

  profileDto.save()
  owner.save()
}


export function handleERC721Transfer(event: generated.Transfer): void {
  const tokenId = event.params.tokenId.toHexString()
  const from = event.params.from.toHexString()
  const to = event.params.to.toHexString()
  
  let previousOwner = Owner.load(from)
  let owner = Owner.load(to)
  let token = Token.load(tokenId)
  const transferId = event.transaction.hash
    .toHexString()
    .concat(':'.concat(event.transactionLogIndex.toHexString()))
  let transfer = Transfer.load(transferId)

  if (previousOwner == null) {
    previousOwner = _createNewOwner(from)
  } else {
    const prevBalance = previousOwner.balance
    if (prevBalance !== null && prevBalance > ZERO_BI) {
      previousOwner.balance = prevBalance.minus(ONE_BI)
    }
  }

  if (owner == null) {
    owner = _createNewOwner(to)
  }

  owner.balance = owner.balance.plus(ONE_BI)

  if (token == null) {
    token = new Token(tokenId)
    token.operator = event.address.toHexString()
  }

  token.owner = to

  if (transfer == null) {
    transfer = new Transfer(transferId)
    transfer.token = tokenId
    transfer.from = from
    transfer.to = to
    transfer.timestamp = event.block.timestamp
    transfer.transaction = _createTransactionIfNotExist(event)
  }


  previousOwner.save()
  owner.save()
  token.save()
  transfer.save()
}