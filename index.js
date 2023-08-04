"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetcher = void 0;
const nft_1 = __importDefault(require("@xoxno/sdk-js/dist/nft"));
const interactions_1 = __importDefault(require("@xoxno/sdk-js/dist/interactions"));
let datArray = [];
const fetcher = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    yield sleep(30 * 10 ** 3);
    let collection_ticker = "HLSR-374950";
    let SC_Interaction = yield interactions_1.default.init();
    try {
        const NFTList = [];
        const auction_IDs = (yield SC_Interaction.getAuctionIDsForCollection(collection_ticker)).slice(0, 10);
        const auction_Array = auction_IDs.filter((id) => !datArray.includes(id));
        for (let idx = 0; idx < auction_Array.length; idx++) {
            try {
                let auction_info = yield SC_Interaction.getAuctionInfo(auction_Array[idx]);
                let identifier = `${auction_info === null || auction_info === void 0 ? void 0 : auction_info.auctioned_token_type}-0${auction_info === null || auction_info === void 0 ? void 0 : auction_info.auctioned_token_nonce.toString(16)}`;
                let price = (auction_info === null || auction_info === void 0 ? void 0 : auction_info.max_bid)
                    ? +(auction_info === null || auction_info === void 0 ? void 0 : auction_info.max_bid) / 10 ** 18
                    : 0;
                const nft = yield new nft_1.default().getNFTByIdentifier(identifier);
                if (!(auction_info === null || auction_info === void 0 ? void 0 : auction_info.max_bid) || !(auction_info === null || auction_info === void 0 ? void 0 : auction_info.min_bid)
                    ? true
                    : +auction_info.max_bid - +(auction_info === null || auction_info === void 0 ? void 0 : auction_info.min_bid) !== 0)
                    return undefined;
                let value = (_b = (_a = nft.metadata.attributes) === null || _a === void 0 ? void 0 : _a.find((attr) => attr.trait_type === "egldAmountShort")) === null || _b === void 0 ? void 0 : _b.value;
                if (value) {
                    NFTList.push({
                        auctionID: auction_Array[idx],
                        identifier,
                        gain: +value - price,
                    });
                    NFTList.sort((a, b) => a.gain < b.gain ? 1 : -1);
                }
                yield sleep(1000);
            }
            catch (err) {
                console.log(`didn't worked : ${err}`);
                return undefined;
            }
        }
        console.log(`\n best deal: ${NFTList[0].identifier} for ${NFTList[0].gain} EGLD`);
        return NFTList;
    }
    catch (err) {
        console.log(`didn't worked : ${err}`);
        return undefined;
    }
});
exports.fetcher = fetcher;
const fn = () => __awaiter(void 0, void 0, void 0, function* () {
    while (true)
        yield (0, exports.fetcher)();
});
fn();
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
