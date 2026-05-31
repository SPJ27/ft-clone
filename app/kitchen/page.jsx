import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";

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
      <div className="bg-[hsl(214,39%,39%)] tracking-wide text-center max-w-xs mx-auto text-white text-2xl font-bold px-13 py-2.5 rounded-2xl mt-10">
        Kitchen
      </div>

      <div className="mt-10">
        <div className="border-8 border-[hsl(214,39%,55%)] bg-[hsl(214,39%,39%)] text-white rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Kitchen!</h2>
          <p className="">
            This is the home page of Flavortown Clone! Here are the basic
            instructions and leaderboard information. Currently, the shipwrights
            page is public so that people can test it out.
          </p>
        </div>
        <div className="bg-[#bc762b] border-[#e7c16e] border-8 mb-5 text-white rounded-2xl p-6 mt-6">
          <h2 className="text-2xl font-bold mb-1">Leaderboard</h2>
          <p className="">Check out the top users and their stats!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#bc762b] border-[#e7c16e] border-8 text-white rounded-2xl p-4">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="justify-between text-md flex items-center gap-4"
              >
                <h1>
                  {index + 1}. {user.name}
                </h1>
                <h1>🍪 {user.cookies}</h1>
              </div>
            ))}
          </div>
          <div className="bg-[#bc762b] border-[#e7c16e] border-8 text-white rounded-2xl p-4">
            {usersHours.map((user, index) => (
              <div
                key={user.id}
                className="justify-between text-md flex items-center gap-4"
              >
                <h1>
                  {index + 1}. {user.name}
                </h1>
                <h1>⏰ {user.hours.toFixed(2)}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
