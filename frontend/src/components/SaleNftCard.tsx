import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import NftCard, { NftCardProps } from "./NftCard";
import { NftMetadata, OutletContext } from "../types";
import { MINT_NFT_CONTRACT } from "../abis/contractAddress";

interface SaleNftCardProps extends NftCardProps {
  metadataArray: NftMetadata[];
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}

const SaleNftCard: FC<SaleNftCardProps> = ({
  tokenId,
  image,
  name,
  metadataArray,
  setMetadataArray,
}) => {
  const [registedPrice, setRegistedPrice] = useState<number>(0);

  const { saleNftContract, account, web3, mintNftContract } =
    useOutletContext<OutletContext>();

  const onClickPurchase = async () => {
    try {
      const nftOwner: string = await mintNftContract.methods
        // @ts-expect-error
        .ownerOf(tokenId)
        .call();

      if (!account || nftOwner.toLowerCase() === account.toLowerCase()) {
        alert("It's your NFT!");

        return;
      }

      const response = await saleNftContract.methods
        // @ts-expect-error
        .purchaseNFT(MINT_NFT_CONTRACT, tokenId)
        .send({
          from: account,
          value: web3.utils.toWei(registedPrice, "ether"),
        });

      const temp = metadataArray.filter((v) => {
        if (v.tokenId !== tokenId) {
          return v;
        }
      });

      setMetadataArray(temp);
    } catch (err) {
      console.error(err);
    }
  };

  const getRegistedPrice = async () => {
    try {
      // @ts-expect-error
      const response = await saleNftContract.methods.nftPrices(tokenId).call();

      setRegistedPrice(Number(web3.utils.fromWei(Number(response), "ether")));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;

    getRegistedPrice();
  }, [saleNftContract]);

  return (
    <div>
      <NftCard tokenId={tokenId} image={image} name={name} />
      <button
        className="flex justify-center font-bold mt-2 border-2 border-black rounded-full px-4 mx-auto hover:bg-gray-500 hover:text-yellow-400"
        onClick={onClickPurchase}
      >
        {registedPrice} ETH
      </button>
    </div>
  );
};

export default SaleNftCard;
