import { cookies } from "next/headers";
import { hoursConverter } from "@/lib/converter";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaFileAlt } from "react-icons/fa";

const ProjectBanner = ({ id, banner_url: image, project_name: title, project_desc, total_hours, devlogs }) => {
  const [hours, minutes] = hoursConverter(total_hours)
  return (
    <Link
      href={`/projects/${id}`}
      className="isolate group text-white w-full border-[10px] sm:border-[12px] md:border-[14px] border-[hsl(22.59,34.14%,51.18%)] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 bg-[#7b4942] hover:brightness-110 hover:scale-[1.015] transition-all duration-200 ease-out flex flex-col max-w-md"
    >
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[hsl(22.59,34.14%,51.18%)] h-36 sm:h-44 md:h-48 w-full">
        {image && (
          <Image
            src={image}
            alt={`${title} banner`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px"
            className="object-cover object-top z-0"
          />
        )}
      </div>

      <h2 className="mt-4 sm:mt-5 px-1 sm:px-2 text-[1.35rem] sm:text-[1.6rem] md:text-[1.85rem] leading-tight font-semibold text-[rgb(249,229,197)] line-clamp-2">
        {title}
      </h2>

      <div className="flex flex-wrap px-1 sm:px-2 text-[11px] sm:text-[13px] md:text-[14px] mt-1.5 font-semibold text-[rgb(215,181,147)] gap-x-5 gap-y-1">
        <span className="flex gap-1 items-center">
          <FaClock className="shrink-0" />
          {hours}h {minutes}m
        </span>
        <span className="flex gap-1 items-center">
          <FaFileAlt className="shrink-0" />
          {devlogs.length} devlog{devlogs.length !== 1 ? "s" : ""}
        </span>
      </div>

      <p className="px-1 sm:px-2 text-[0.9rem] sm:text-[1rem] md:text-[1.08rem] mt-2.5 sm:mt-3 leading-snug font-medium text-[rgb(249,229,197)] opacity-85 line-clamp-3 flex-1">
        {project_desc}
      </p>
    </Link>
  )
}

const page = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, {
    headers: { Cookie: (await cookies()).toString() },
  });
  const { user, userProjects } = await res.json();

  return (
    <div className="mx-auto max-w-7xl px-5 mt-15">
      <div className="mb-5 text-center text-3xl mx-auto max-w-md bg-[#7b4942] px-7 py-5 rounded-2xl font-extrabold border-[hsl(22.59,34.14%,51.18%)] border-10 text-[rgb(249,229,197)]">
        Flavortown User Profile
      </div>
      <div className="grid grid-cols-1 lg:px-30 lg:grid-cols-2">
        <div>
          <div className="mb-5 text-xl mx-auto max-w-md text-[#7b4942] bg-[#d7b593] px-7 py-5 rounded-2xl font-medium border-[hsl(22.59,34.14%,51.18%)] border-[0.5px]">
            ID: {user.id}
            <br />
            Name: {user.name}
            <br />
            Email: {user.email}
            <br />
            Joined On: {new Date(user.created_at).toLocaleDateString()}
          </div>
          <div className="mb-5 text-xl mx-auto max-w-md text-[#7b4942] bg-[#d7b593] px-7 py-5 rounded-2xl font-medium border-[hsl(22.59,34.14%,51.18%)] border-[0.5px]">
            Cookies: 🍪{user.cookies}
            <br />
            Vote Balance: {user.balance}
            <br />
            Total Hours: {user.hours.toFixed(2)}h
            <br/>
            
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-6 lg:mt-0">
          {userProjects.length > 0 ? (
            userProjects.map((project) => (
              <ProjectBanner key={project.id} {...project} />
            ))
          ) : (
            <div className="text-xl mx-auto max-w-md bg-[#7b4942] px-7 py-5 rounded-2xl font-extrabold border-[hsl(22.59,34.14%,51.18%)] border-10 text-[rgb(249,229,197)]">
              No projects found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;