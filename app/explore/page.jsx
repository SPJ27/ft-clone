import Title from "@/components/Title";
import { hoursConverter } from "@/lib/converter";
import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaClock, FaFileAlt } from "react-icons/fa";

const ProjectBanner = async ({
  id,
  banner_url: image,
  project_name: title,
  project_desc,
  user_name: user,
  user_id,
  total_hours,
  devlogs,
}) => {
  const [hours, minutes] = hoursConverter(total_hours);
  const supabase = createClient(await cookies());
  const { data: creator } = await supabase
    .from("users")
    .select()
    .eq("hackclub_id", user_id)
    .single();
  return (
    <div
      style={{
        backgroundImage: `url("	https://flavortown.hackclub.com/assets/mask/project-card-bd9acd6b.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Jua, sans-serif",
        minHeight: "50px",
      }}
      className="text-white w-full border-14 mx-auto border-[hsl(22.59,34.14%,51.18%)] rounded-3xl p-5 bg-[#7b4942] bg-blend-multiply"
    >
      <Link
        href={`/projects/${id}`}
        className="relative rounded-2xl items-center flex overflow-hidden bg-[hsl(22.59,34.14%,51.18%)] h-48"
      >
        {image && (
          <Image
            src={image}
            alt="project image"
            width={300}
            height={100}
            className="object-cover mx-auto object-top"
          />
        )}
      </Link>
      <div className="mt-6 px-3 flex flex-col">
        <Link
          href={`/projects/${id}`}
          className="md:text-[1.6rem] text-[1.4rem] leading-tight flex-1 text-[rgb(249,229,197)]"
        >
          {title}
        </Link>
        <Link
          href={`/u/${creator?.id || user_id}`}
          className="hover:underline text-xs md:text-md mb-1 text-[rgb(199,179,158)]"
        >
          By: {creator?.name || user}
        </Link>
      </div>
      <Link
        href={`/projects/${id}`}
        className="flex px-3 md:text-[13px] text-[12px] mt-1 text-[rgb(215,181,147)] gap-10"
      >
        <span className="flex gap-1 items-center">
          <FaClock /> Hours: {hours}h {minutes}m
        </span>
        <span className="flex gap-1 items-center">
          <FaFileAlt /> Devlogs: {devlogs.length}
        </span>
      </Link>
      <Link
        href={`/projects/${id}`}
        className="px-3 md:text-[1rem] text-[0.875rem] mt-7 leading-tight flex-1  text-[rgb(249,229,197)]"
      >
        {project_desc.substring(0, 70).trimEnd()}...
      </Link>
    </div>
  );
};

const page = async () => {
  const supabase = createClient(await cookies());
  const { data: projects, error } = await supabase.from("projects").select("*");

  if (error || !projects) {
    return (
      <div className="flex w-full items-center justify-center">
        <p className="text-white mt-10">Failed to load projects.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen md:pl-24 lg:pl-28 pb-24 md:pb-8">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <Title text="Explore Projects" />

        {projects?.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-12 lg:gap-x-16 gap-y-8 sm:gap-y-10 md:gap-y-12 lg:gap-y-14 mt-8 sm:mt-10 md:mt-12">
            {projects.map((project, i) => (
              <ProjectBanner key={project.id ?? i} {...project} />
            ))}
          </div>
        ) : (
          <div className="text-center text-[rgb(249,229,197)] opacity-60 mt-24 text-lg">
            No projects yet.
          </div>
        )}
        <div className="col-span-full flex justify-center mt-4">
          <Link
            href="/projects/new"
            className="flex text-[rgb(245,216,198)] bg-[rgb(78,44,51)] justify-center items-center py-4 sm:py-5 px-8 text-lg sm:text-xl rounded-lg h-12 sm:h-10 gap-2 w-full max-w-xs"
          >
            + New Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
