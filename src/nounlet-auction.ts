import {
    ActiveModules as ActiveModulesEvent,
    AuctionBid as AuctionBidEvent,
    AuctionCreated as AuctionCreatedEvent,
    AuctionExtended as AuctionExtendedEvent,
    AuctionSettled as AuctionSettledEvent,
} from "../generated/NounletAuction/NounletAuction";
import { ActiveModules, AuctionBid, AuctionCreated, AuctionExtended, AuctionSettled } from "../generated/schema";

export function handleActiveModules(event: ActiveModulesEvent): void {
    let entity = new ActiveModules(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity._vault = event.params._vault;
    entity._modules = event.params._modules;
    entity.save();
}

export function handleAuctionBid(event: AuctionBidEvent): void {
    let entity = new AuctionBid(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity._vault = event.params._vault;
    entity._token = event.params._token;
    entity._id = event.params._id;
    entity._sender = event.params._sender;
    entity._value = event.params._value;
    entity._extended = event.params._extended;
    entity.save();
}

export function handleAuctionCreated(event: AuctionCreatedEvent): void {
    let entity = new AuctionCreated(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity._vault = event.params._vault;
    entity._token = event.params._token;
    entity._id = event.params._id;
    entity._startTime = event.params._startTime;
    entity._endTime = event.params._endTime;
    entity.save();
}

export function handleAuctionExtended(event: AuctionExtendedEvent): void {
    let entity = new AuctionExtended(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity._endTime = event.params._endTime;
    entity._vault = event.params._vault;
    entity._token = event.params._token;
    entity._id = event.params._id;
    entity.save();
}

export function handleAuctionSettled(event: AuctionSettledEvent): void {
    let entity = new AuctionSettled(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity._vault = event.params._vault;
    entity._token = event.params._token;
    entity._id = event.params._id;
    entity._winner = event.params._winner;
    entity._amount = event.params._amount;
    entity.save();
}
