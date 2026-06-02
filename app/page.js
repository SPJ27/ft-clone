"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const Page = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      const verifyLogin = await fetch(`/api/user`);
      const res = await verifyLogin.json();
      if (res.status == 200) {
        setLoggedIn(true);
      }
      setLoading(false);
    };
    syncUser();
  }, []);
  const handleLogin = () => {
    if (loggedIn) {
      window.location.href = "/kitchen";
      return;
    }
    const scope = encodeURIComponent("profile read");
    window.location.href =
      `https://hackatime.hackclub.com/oauth/authorize?` +
      `client_id=${process.env.NEXT_PUBLIC_HACKATIME_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${scope}`;
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-2 justify-center h-screen">
        <Image src="/image.png" alt="ft_logo" width={200} height={200} />
        <h1 className="text-2xl font-medium text-center text-[#442b28]">
          Cook personal projects. (NOT) Win cool prizes.
        </h1>
        <button
          className="bg-[hsl(356,49%,43%)] text-white rounded-xl px-4 py-1 hover:bg-[hsl(356,54%,44%)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : loggedIn
              ? "Go to the kitchen!"
              : "Login with Hack Club"}
        </button>
        <div className="text-sm text-center text-[#b18782] mt-1">
          *Not the real website, just a clone, so no landing page:)
        </div>
      </div>
    </div>
  );
};

export default Page;
