import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";

import { NftMetadata, OutletContext } from "../types";

const Detail: FC = () => {
  const [metadata, setMetadata] = useState<NftMetadata>();
  const [xDeg, setXDeg] = useState<number>(0);
  const [yDeg, setYDeg] = useState<number>(0);

  const { tokenId } = useParams();

  const { mintNftContract } = useOutletContext<OutletContext>();

  const navigate = useNavigate();

  const getMyNFT = async () => {
    try {
      if (!mintNftContract) return;

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

  const onMouseMoveImage = (e: any) => {
    setXDeg(e.clientY * (5 / 128) - 31);
    setYDeg(e.clientX * (5 / 128) - 31);
  };

  const onMouseLeaveImage = () => {
    setXDeg(0);
    setYDeg(0);
  };

  useEffect(() => {
    getMyNFT();
  }, [mintNftContract]);

  useEffect(() => console.log(yDeg), [yDeg]);

  return (
    <div className="grow flex justify-center items-center relative">
      <button
        className="absolute top-8 left-8 hover:text-gray-500 text-2xl flex justify-center items-center font-bold gap-2"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeftLong /> BACK
      </button>
      {metadata && (
        <div className="flex flex-col justify-center items-center">
          <div
            onMouseMove={onMouseMoveImage}
            onMouseLeave={onMouseLeaveImage}
            style={{
              transform: `perspective(500px) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`,
            }}
          >
            <img
              className="w-100 h-100"
              src={metadata.image}
              alt={metadata.name}
            />
          </div>
          <div className="font-semibold mt-1 text-center">{metadata.name}</div>
          <div className="mt-1 text-center">{metadata.description}</div>
          <ul className="mt-1 flex flex-wrap gap-1">
            {metadata.attributes.map((v, i) => (
              <li key={i}>
                <span className="font-semibold">{v.trait_type}: </span>
                <span>{v.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Detail;
