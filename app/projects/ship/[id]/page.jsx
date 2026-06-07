"use client";
import Title from "@/components/Title";
import { useParams } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const [text, setText] = useState("");
  const [status, setStatus] = useState('null');
  const params = useParams();
  const project_id = params.id;
  return (
    <div>
      <Title text={`Ship!`} />
      <form className="max-w-4xl mx-auto text-xl text-white rounded-2xl mt-6 bg-[#bc762b] flex flex-col border-[#e7c16e] border-14 p-8 space-y-4">
        Ship Text:{" "}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="block border border-[#e7c16e] rounded-lg p-2 text-base bg-[#a8621f] placeholder-[#e7c16e]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#e7c16e] w-full"
        />

        <button
          className="w-full py-1.5 max-w-60 mx-auto bg-[hsl(214,39%,39%)] hover:bg-[hsl(214,39%,32%)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-md rounded-xl transition-colors cursor-pointer"
          onClick={async (e) => {
            e.preventDefault();
            const res = await fetch("/api/ship/user", {
              method: "POST",
              body: JSON.stringify({ project_id, ship_text: text }),
            });
            const data = await res.json();
            if (!res.ok) {
              setStatus(data.error || "Failed to ship. Please try again.");
            }
            else {
              setStatus("Shipped successfully!");
            }
          }}
        >
          Ship
        </button>
        {status && <p className="text-center">{status}</p>}
      </form>
    </div>
  );
};

export default Page;
