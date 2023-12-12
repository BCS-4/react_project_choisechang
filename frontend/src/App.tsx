import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import My from "./pages/my";
import Sale from "./pages/sale";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my" element={<My />} />
        <Route path="/sale" element={<Sale />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
