import React from "react";
import HomePage from "./pages/HomePage";
import GiveMeFeedBack from "./components/GiveMeFeedBack";

import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";

import Footer from "./components/Footer";
import MintTokenPage from "./pages/MintTokenPage";
import BurnTokenPage from "./pages/BurnTokenPage";
import BlacklistUserPage from "./pages/BlacklistUserPage";
import TransferPage from "./pages/TransferPage";

const App = () => {
  return (
    <div className=" justify-between  max-w-full p-2 mx-6 bg-white ">
      <MainLayout />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mint-token" element={<MintTokenPage />} />
        <Route path="/burn-token" element={<BurnTokenPage />} />
        <Route path="/blacklist" element={<BlacklistUserPage />} />
        <Route path="/transfer" element={<TransferPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
