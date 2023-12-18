import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

import { NftMetadata, OutletContext } from "../types";
import SaleNftCard from "../components/SaleNftCard";

const Sale: FC = () => {
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract, saleNftContract } =
    useOutletContext<OutletContext>();

  const getSaleNFTs = async () => {
    try {
      const onSaleNFTs: bigint[] = await saleNftContract.methods
        .getOnSaleNFTs()
        .call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < onSaleNFTs.length; i++) {
        const metadataURI: string = await mintNftContract.methods
          // @ts-expect-error
          .tokenURI(Number(onSaleNFTs[i]))
          .call();

        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(onSaleNFTs[i]) });
      }
      setMetadataArray(temp);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;

    getSaleNFTs();
  }, [saleNftContract]);

  return (
    <div className="grow">
      <div className="text-center py-8">
        <h1 className="font-bold text-2xl">{`< Sale NFTs >`}</h1>
      </div>
      <ul className="p-8 grid grid-cols-2 gap-8">
        {metadataArray?.map((v, i) => (
          <SaleNftCard
            key={i}
            tokenId={v.tokenId!}
            image={v.image}
            name={v.name}
            metadataArray={metadataArray}
            setMetadataArray={setMetadataArray}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sale;
