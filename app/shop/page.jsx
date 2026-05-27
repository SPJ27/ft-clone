'use client'
import React from "react";
import Image from "next/image";

const page = () => {
  const shopItems = [
    {
      id: 1,
      name: "MacBook Air M5",
      desc: "This is like mac mini but portable and with a screen (and keyboard and trackpad).",
      banner: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTexDKRBGcDApaLVB00BOc6DxrZ_9nB8vh-YzhsRz-a57exqGGpQfsCruncVpPyY1UGWFdKSmR4DdezrLfIQ9YJHM1sYRMYluJ5BuXrbHlyo_ZdpImHUtuHkQ',
      cookies: 5000,
    },
    {
      id: 2,
      name: "iPad Air",
      desc: "Like an iphone but bigger and pencil support.",
      banner: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTexDKRBGcDApaLVB00BOc6DxrZ_9nB8vh-YzhsRz-a57exqGGpQfsCruncVpPyY1UGWFdKSmR4DdezrLfIQ9YJHM1sYRMYluJ5BuXrbHlyo_ZdpImHUtuHkQ',
      cookies: 2500,
    },
  ];
  return (
    <div className="px-20 w-full max-w-6xl mx-auto">
      <div className="bg-[hsl(214,39%,39%)] tracking-wide text-center max-w-xs mx-auto text-white text-3xl font-bold px-13 py-2.5 rounded-2xl mt-10   ">
        Shop
      </div>
      <div className="grid grid-cols-2 px-20">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className="border-[0.5px] border-[hsl(22.59,34.14%,51.18%)] w-100 rounded-2xl mt-10  bg-[#f8e9d3] max-w-2xl mx-auto"
          >
            <div className="w-full py-3.5 bg-[#e8cfb4] rounded-2xl">
            <Image
              src={item.banner}
              alt={item.name}
              width={200}
              height={200}
              className="h-auto w-91 m-auto rounded-2xl object-cover "
            />
            </div>
            <div className="px-5 py-3">
            <h2 className="text-2xl font-medium  text-[#5c3934]">{item.name}</h2>
            <p className="mt-2 text-[#977873]">{item.desc.substring(0, 50)}...</p>
            <div className="flex justify-between items-center mt-4">
              <div className="font-medium text-[#5c3934] text-lg">🍪{item.cookies}</div>
              <div className="font-medium text-[#5c3934] text-lg">~{Math.round(item.cookies/10)} hrs</div>
            </div>
            <button onClick={() => {alert('Hi! Unfortunately, this is a clone and you cannot purchase items.');}} className="mt-4 w-full bg-[hsl(214,39%,39%)] text-white py-2 rounded-2xl hover:bg-[hsl(214,39%,29%)] transition-colors">
              Buy Now
            </button>
          </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default page;
