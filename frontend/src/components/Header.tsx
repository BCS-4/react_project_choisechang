import { useSDK } from "@metamask/sdk-react";
import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt, FaWallet } from "react-icons/fa";
import { FaHouse, FaSackDollar, FaUser } from "react-icons/fa6";

interface HeaderProps {
  account: string;
  setAccount: Dispatch<SetStateAction<string>>;
}

const Header: FC<HeaderProps> = ({ account, setAccount }) => {
  const { sdk } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts: any = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="p-2 flex justify-between">
      <div className="flex gap-4 text-3xl font-bold mt-1">
        <Link to="/">
          <FaHouse className="hover:text-purple-500" />
        </Link>
        <Link to="/my">
          <FaUser className="hover:text-sky-500" />
        </Link>
        <Link to="/sale">
          <FaSackDollar className="hover:text-yellow-500" />
        </Link>
      </div>
      <div>
        {account ? (
          <div className="text-xl flex font-bold">
            <span className="flex items-center hover:text-gray-500">
              <FaWallet />: {account.substring(0, 7)}...
              {account.substring(account.length - 5)}
            </span>
            <button
              className="ml-2 text-3xl hover:text-gray-500"
              onClick={() => setAccount("")}
            >
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <button
            className="bg-amber-300 hover:bg-amber-500 font-bold text-xl rounded-full px-4 py-1"
            onClick={onClickMetaMask}
          >
            🦊 Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
