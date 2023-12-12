import { FC } from "react";
import { Outlet } from "react-router-dom";

const Layout: FC = () => {
  return (
    <div className="bg-red-100">
      <header></header>
      <Outlet />
      <footer></footer>
    </div>
  );
};

export default Layout;
