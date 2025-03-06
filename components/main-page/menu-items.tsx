"use client";

import React from "react";

const MenuItem: React.FC<{ text: string }> = ({ text }) => {
  return (
    <button className="text-4xl text-center text-red-700 cursor-pointer h-[81px] leading-[81px] w-[315px] max-sm:text-3xl max-sm:h-[70px] max-sm:leading-[70px] max-sm:w-[280px]">
      {text}
    </button>
  );
};

const MenuItems: React.FC = () => {
  return (
    <nav className="flex absolute left-2/4 flex-col gap-8 items-center -translate-x-2/4 top-[333px] max-md:top-[25vh] max-sm:top-[20vh]">
      <MenuItem text="Play Now" />
      <MenuItem text="Settings" />
      <MenuItem text="Quit" />
    </nav>
  );
};

export default MenuItems;