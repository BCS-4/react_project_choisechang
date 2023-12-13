import { Dispatch, FC, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import { IoCloseCircle } from "react-icons/io5";

interface MintModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MintModal: FC<MintModalProps> = ({ setIsOpen }) => {
  const [metadata, setMetadata] = useState<NftMetadata>();
  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const onClickMint = async () => {
    try {
      if (!mintNftContract || !account) return;

      //   const response = await mintNftContract.methods
      //     .mintNFT()
      //     .send({ from: account });

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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
      <div className="p-8 bg-white rounded-xl relative">
        <div className="mb-4">
          <button
            className="absolute -top-3 -right-3"
            onClick={() => setIsOpen(false)}
          >
            <IoCloseCircle className="w-7 h-7 hover:text-gray-500" />
          </button>
        </div>
        {metadata ? (
          <div className="w-60">
            <img
              className="w-60 h-60"
              src={metadata.image}
              alt={metadata.name}
            />
            <div className="font-semibold mt-1">{metadata.name}</div>
            <div className="mt-1">{metadata.description}</div>
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
                className="hover:text-gray-500"
                onClick={() => setIsOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>NFT를 민팅하시겠습니까?</div>
            <div className="text-center mt-4">
              <button className="hover:text-gray-500" onClick={onClickMint}>
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
