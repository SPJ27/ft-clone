import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import Title from "@/components/Title";
import { FaClock } from "react-icons/fa";
import Link from "next/link";

const Leaderboard = ({ list, type = "hours" }) => {
  return (
    <div
      style={{
        backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05)),
            linear-gradient(90deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05))
            `,
        backgroundSize: "100px 100px",
      }}
      className="bg-[#bc762b] border-[#e7c16e] border-8 text-white rounded-2xl p-4"
    >
      {list.map((user, index) => (
        <Link
          href={`/u/${user.id}`}
          key={user.id}
          className="justify-between text-md flex items-center gap-4"
        >
          <h1 className="hover:underline">
            {index + 1}. {user.name}
          </h1>
          <h1 className="flex items-center gap-1 ">
            {type === "hours" ? (
              <>
                <FaClock className="text-xs" />
                {user.hours.toFixed(2)}
              </>
            ) : (
              <>🍪 {user.cookies}</>
            )}
          </h1>
        </Link>
      ))}
    </div>
  );
};

const page = async () => {
  const supabase = await createClient(await cookies());
  const { data: users } = await supabase
    .from("users")
    .select()
    .order("cookies", { ascending: false })
    .limit(20);
  const { data: usersHours } = await supabase
    .from("users")
    .select()
    .order("hours", { ascending: false })
    .limit(20);
  return (
    <div className="px-4 w-full mx-auto max-w-3xl">
      <Title text="Kitchen" />

      <div className="mt-10 ">
        <div
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05)),
            linear-gradient(90deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05))
            `,
            backgroundSize: "100px 100px",
          }}
          className="border-8 border-[hsl(214,39%,55%)] bg-[hsl(214,39%,39%)] text-white rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Welcome to the Kitchen!</h2>
          <p className="">
            This is the home page of Flavortown Clone! Here are the basic
            instructions and leaderboard information. Currently, the shipwrights
            page is public so that people can test it out.
          </p>
        </div>
        <div
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05)),
            linear-gradient(90deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05))
            `,
            backgroundSize: "100px 100px",
          }}
          className="bg-[#bc762b] border-[#e7c16e] border-8 mb-5 text-white rounded-2xl p-6 mt-6"
        >
          <h2 className="text-2xl font-bold mb-1">Leaderboard</h2>
          <p className="">Check out the top users and their stats!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Leaderboard list={users} type="cookies" />
          <Leaderboard list={usersHours} type="hours" />
        </div>
      </div>
    </div>
  );
};

export default page;
