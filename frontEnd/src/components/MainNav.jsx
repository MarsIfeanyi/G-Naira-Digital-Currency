import React from "react";
import { Link } from "react-router-dom";

const MainNav = () => {
  return (
    <div>
      <div className=" items-center justify-center mx-auto flex flex-col md:flex-row space-x-0 md:space-x-10 space-y-10 md:space-y-0 mt-24 ">
        <Link to="/mint-token">
          <button className="bg-blue-600 rounded-xl text-white  py-2 px-3 text-xl ">
            Mint Token
          </button>
        </Link>

        <Link to="/burn-token">
          <button className="bg-red-500 rounded-xl text-white  py-2 px-3 text-xl ">
            Burn Token
          </button>
        </Link>

        <Link to="/blacklist">
          <button className="bg-blue-900 rounded-xl text-white  py-2 px-3 text-xl">
            BlackList User
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MainNav;
