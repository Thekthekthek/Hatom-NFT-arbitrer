import NFTModule from "@xoxno/sdk-js/dist/nft";
import SCInteraction from "@xoxno/sdk-js/dist/interactions";
// (async () => {
// let identifier = 'HLSR-374950-0120';
//   const nft = await new NFTModule().getNFTByIdentifier(identifier);
//   console.log(nft.metadata.attributes);
// })();

type NFTonSale = {
  auctionID: number;
  identifier: string;
  gain: number;
};

let datArray: number[] = [];

export const fetcher = async (): Promise<NFTonSale[] | undefined> => {
  await sleep(30 * 10 ** 3);
  let collection_ticker = "HLSR-374950";
  let SC_Interaction = await SCInteraction.init();
  try {
    const NFTList: NFTonSale[] = [];
    const auction_IDs = (
      await SC_Interaction.getAuctionIDsForCollection(collection_ticker)
    ).slice(0, 10);
    const auction_Array = auction_IDs.filter((id) => !datArray.includes(id));
    for (let idx = 0; idx < auction_Array.length; idx++) {
      try {
        let auction_info = await SC_Interaction.getAuctionInfo(
          auction_Array[idx]
        );
        let identifier = `${
          auction_info?.auctioned_token_type
        }-0${auction_info?.auctioned_token_nonce.toString(16)}`;

        let price = auction_info?.max_bid
          ? +auction_info?.max_bid / 10 ** 18
          : 0;
        const nft = await new NFTModule().getNFTByIdentifier(identifier);
        if (
          !auction_info?.max_bid || !auction_info?.min_bid
            ? true
            : +auction_info.max_bid - +auction_info?.min_bid !== 0
        )
          return undefined;
        let value = nft.metadata.attributes?.find(
          (attr) => attr.trait_type === "egldAmountShort"
        )?.value;
        if (value) {
          NFTList.push({
            auctionID: auction_Array[idx],
            identifier,
            gain: +value - price,
          });
          NFTList.sort((a: NFTonSale, b: NFTonSale) =>
            a.gain < b.gain ? 1 : -1
          );
        }

        await sleep(1000);
      } catch (err) {
        console.log(`didn't worked : ${err}`);
        return undefined;
      }
    }
    console.log(
      `\n best deal: ${NFTList[0].identifier} for ${NFTList[0].gain} EGLD`
    );
    return NFTList;
  } catch (err) {
    console.log(`didn't worked : ${err}`);
    return undefined;
  }
};

const fn = async () => {
  while (true) await fetcher();
};

fn();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
