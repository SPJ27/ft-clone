import React from "react";

const page = () => {
  const shopItems = [
    {
      id: 1,
      name: "MacBook Air M5",
      desc: "This is like mac mini but portable and with a screen (and keyboard and trackpad).",
      cookies: 5000,
    },
    {
      id: 2,
      name: "iPad Air",
      desc: "Like an iphone but bigger and pencil support.",
      cookies: 2500,
    },
  ];
  return (
    <div className="px-20 w-full max-w7xl">
      <div className="bg-[hsl(214,39%,39%)] tracking-wide text-center max-w-xs mx-auto text-white text-3xl font-bold px-13 py-2.5 rounded-2xl mt-10   ">
        Shop
      </div>{" "}
    </div>
  );
};

export default page;
