"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CgExtension } from "react-icons/cg";
import {
  FaCompass,
  FaQuestionCircle,
  FaShoppingCart,
  FaStar,
  FaUtensils,
  FaShip,
  FaSignOutAlt,
  FaBook,
} from "react-icons/fa";

const navItems = [
  { icon: <FaUtensils />, label: "Kitchen", to: "/kitchen" },
  { icon: <FaCompass />, label: "Explore", to: "/explore" },
  { icon: <CgExtension />, label: "Projects", to: "/projects" },
  { icon: <FaQuestionCircle />, label: "About", to: "/about" },
  { icon: <FaStar />, label: "Vote", to: "/vote" },
  { icon: <FaShoppingCart />, label: "Shop", to: "/shop" },
  { icon: <FaShip />, label: "Shipwright", to: "/shipwright" },
  { icon: <FaBook />, label: "Docs", to: "/docs" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  if (pathname === "/") return null;
  useEffect(() => {
    const func = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
      );
      const { user: userRes } = await res.json();
      setUser(userRes);
    };
    func();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <>
      <div className="hidden md:block fixed left-12 top-1/2 -translate-y-1/2 z-50 group">
        <div
          style={{
            backgroundImage: `
      linear-gradient(rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05)),
      linear-gradient(90deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05))
    `,
            backgroundSize: "100px 100px",
          }}
          className="w-30 group-hover:w-64 transition-[width] duration-300 ease-in-out bg-[#4f8fba] text-[rgb(249,229,197)] flex flex-col rounded-2xl overflow-hidden h-153"
        >
          <div className="flex flex-col flex-1 py-6">
            {navItems.map(({ icon, label, to }) => {
              const active =
                to === "/" ? pathname === "/" : pathname.startsWith(to);
              return (
                <Link
                  href={to}
                  key={label}
                  className={`flex items-center py-4 text-center cursor-pointer whitespace-nowrap transition-colors duration-150 ${active ? "bg-[hsl(214,39%,42%)]" : "hover:bg-[hsl(214,39%,39%)]"}`}
                >
                  <span className="text-[30px] w-30 shrink-0 flex justify-center">
                    {icon}
                  </span>
                  <span className="text-[18px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 overflow-hidden">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="relative bg-[rgb(190,75,83)] rounded-b-2xl h-16 shrink-0 flex items-center">
            <div className="flex items-center flex-1 hover:bg-[rgb(170,60,68)] transition-colors h-full rounded-b-2xl">
              <div className="w-30 shrink-0 flex justify-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl" />
              </div>
              {user && (
                <Link
                  href="/u/me"
                  className="absolute left-24 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100"
                >
                  <p className="text-[20px] mt-1.5 font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-md opacity-70">🍪 {user.cookies}</p>
                </Link>
              )}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 hover:text-white/70 text-white"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#6199c2] text-[rgb(249,229,197)]">
        <div className="flex flex-row items-center justify-between px-2">
          {navItems.map(({ icon, label, to }) => {
            const active =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                href={to}
                key={label}
                className="flex items-center justify-center py-3 flex-1 cursor-pointer"
              >
                <span
                  className={`text-[17px] cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-150 ${active ? "bg-[hsl(214,39%,32%)]" : "hover:bg-[hsl(214,39%,39%)]"}`}
                >
                  {icon}
                </span>
              </Link>
            );
          })}
        </div>

        {user && (
          <div className="flex items-center justify-center gap-3 py-1">
            <Link href="/me" className="flex flex-col items-center">
              <p className="text-[20px] font-medium leading-none">
                {user.name}
              </p>
              <p className="text-md opacity-70">🍪 {user.cookies}</p>
            </Link>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaSignOutAlt size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
