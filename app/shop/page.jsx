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
            className="border-4 border-[hsl(22.59,34.14%,51.18%)] w-100 rounded-3xl mt-10 text-[#7b4942] bg-[#d7b593] max-w-2xl mx-auto"
          >
            <Image
              src={item.banner}
              alt={item.name}
              width={200}
              height={200}
              className="w-full mx-auto mt-4"
            />
            <div className="px-5 py-3">
            <h2 className="text-2xl font-semibold">{item.name}</h2>
            <p className="mt-2">{item.desc}</p>
            <div className="mt-4 font-bold text-lg">Cost: {item.cookies} 🍪</div>
            
          </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default page;
