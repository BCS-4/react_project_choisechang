import { FC, FormEvent, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import NftCard, { NftCardProps } from "./NftCard";
import { MINT_NFT_CONTRACT } from "../abis/contractAddress";
import { OutletContext } from "../types";

interface MyNftCardProps extends NftCardProps {
  saleStatus: boolean;
}

const MyNftCard: FC<MyNftCardProps> = ({
  tokenId,
  image,
  name,
  saleStatus,
}) => {
  const [price, setPrice] = useState<string>("");
  const [registedPrice, setRegistedPrice] = useState<number>(0);

  const { saleNftContract, account, web3 } = useOutletContext<OutletContext>();

  const onSubmitForSale = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (isNaN(+price)) return;

      const response = await saleNftContract.methods
        .setForSaleNFT(
          // @ts-expect-error
          MINT_NFT_CONTRACT,
          tokenId,
          web3.utils.toWei(Number(price), "ether")
        )
        .send({ from: account });

      setRegistedPrice(+price);
      setPrice("");
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
      {registedPrice ? (
        <div className="flex justify-center font-bold mt-2 border-2 border-black rounded-full w-32 mx-auto">
          {registedPrice} ETH
        </div>
      ) : (
        saleStatus && (
          <form className="flex justify-center mt-2" onSubmit={onSubmitForSale}>
            <input
              type="text"
              value={price}
              className="rounded-full w-32 border-2 mr-2"
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="submit"
              value="등 록"
              className="border-2 rounded-full px-2 border-black font-bold hover:text-yellow-400 hover:bg-gray-500"
            />
          </form>
        )
      )}
    </div>
  );
};

export default MyNftCard;
