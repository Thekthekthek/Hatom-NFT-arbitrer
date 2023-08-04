type NFTonSale = {
    auctionID: number;
    identifier: string;
    gain: number;
};
export declare const fetcher: () => Promise<NFTonSale[] | undefined>;
export {};
