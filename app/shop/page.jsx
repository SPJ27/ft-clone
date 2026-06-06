'use client'
import React from "react";
import Image from "next/image";
import Title from "@/components/Title";

const Page = () => {
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
      banner: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTeyexPdgjSRgjkNh79rcnCbPPTDnDrs7n3N9PXncWp7VA1u40WpK5K5cqNZYPZehgV2dYOf9vyT7aENOvlL4afz_Ae358coKDVLG248J9wgRgU2HYqZgCxz5lfEFIHLVg69KKrC-I&usqp=CAc',
      cookies: 2500,
    },
  ];
  return (
    <div className="px-20 w-full max-w-4xl mx-auto">
      <Title text="Shop" />
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto w-full">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className="max-w-xs border-[0.5px] border-[hsl(23,48%,82%)] shadow-2xl w-full rounded-2xl mt-10  bg-[#f8e9d3] mx-auto"
          >
            <div className="w-full py-3.5 bg-[#e8cfb4] rounded-t-2xl">
            <Image
              src={item.banner}
              alt={item.name}
              width={200}
              height={200}
              className="w-auto h-45 m-auto rounded-t-2xl object-cover "
            />
            </div>
            <div className="px-5 py-3">
            <h2 className="text-2xl  text-[#5c3934]">{item.name}</h2>
            <p className="mt-0.5 text-sm text-[#977873]">{item.desc.substring(0, 50)}...</p>
            <div className="flex font-medium text-[#5c3934] text-md justify-between items-center mt-2">
              <div>🍪{item.cookies}</div>
              <div>~{Math.round(item.cookies/10)} hrs</div>
            </div>
            <button onClick={() => {alert('Hi! Unfortunately, this is a clone and you cannot purchase items.');}} className="mt-4 w-full bg-[hsl(214,39%,39%)] text-white py-2 rounded-lg hover:bg-[hsl(214,39%,29%)] transition-colors">
              Buy Now
            </button>
          </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Page;
