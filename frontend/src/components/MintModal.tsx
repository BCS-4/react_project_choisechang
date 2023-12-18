import { Dispatch, FC, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { IoCloseCircle } from "react-icons/io5";

import { NftMetadata, OutletContext } from "../types";
import { FaSpinner } from "react-icons/fa6";

interface MintModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  metadataArray: NftMetadata[];
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}

const MintModal: FC<MintModalProps> = ({
  setIsOpen,
  metadataArray,
  setMetadataArray,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<NftMetadata>();
  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const onClickMint = async () => {
    try {
      if (!mintNftContract || !account) return;

      setIsLoading(true);

      await mintNftContract.methods.mintNFT().send({ from: account });

      // @ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      const tokenId = await mintNftContract.methods
        // @ts-expect-error
        .tokenOfOwnerByIndex(account, Number(balance) - 1)
        .call();

      const metadataURI: string = await mintNftContract.methods
        // @ts-expect-error
        .tokenURI(Number(tokenId))
        .call();

      const response = await axios.get(metadataURI);

      setMetadata(response.data);
      setMetadataArray([response.data, ...metadataArray]);

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
      <div className="p-8 bg-white rounded-xl shadow-lg relative">
        <div className="mb-4">
          <button
            className="absolute -top-3 -right-3"
            onClick={() => setIsOpen(false)}
          >
            <IoCloseCircle className="w-7 h-7 hover:text-red-500" />
          </button>
        </div>
        {metadata ? (
          <div className="w-60">
            <img
              className="w-60 h-60"
              src={metadata.image}
              alt={metadata.name}
            />
            <div className="font-semibold mt-1 text-center">
              {metadata.name}
            </div>
            <div className="mt-1 text-center">{metadata.description}</div>
            <ul className="mt-1 flex flex-wrap gap-1">
              {metadata.attributes.map((v, i) => (
                <li key={i}>
                  <span className="font-semibold">{v.trait_type}: </span>
                  <span>{v.value}</span>
                </li>
              ))}
            </ul>
            <div className="text-center mt-4 ">
              <button
                className="bg-gray-700 text-white hover:text-cyan-300 text-md font-bold rounded-full px-2"
                onClick={() => setIsOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              {isLoading ? (
                <div className="flex items-center gap-2 text-2xl">
                  Loading <FaSpinner className="animate-spin" />
                </div>
              ) : (
                "NFT를 민팅하시겠습니까?"
              )}
            </div>
            <div className="text-center mt-4">
              <button
                className="bg-gray-700 text-white hover:text-cyan-300 text-md font-bold rounded-full px-2"
                onClick={onClickMint}
              >
                확인
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MintModal;
