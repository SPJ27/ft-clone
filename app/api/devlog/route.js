import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUser } from "../projects/route";

async function getHours(session_id, project_id, cookies) {
  const supabase = createClient(cookies);

  const currentUser = await getUser()

  let hours = 0;

  const { data: projectRes, error: projectError } = await supabase
    .from("projects")
    .select("hackatime_projects, user_name, total_hours")
    .eq("id", project_id)
    .single();
  console.log(currentUser)
  if (projectError || !projectRes) {console.log('1'); return -1};
  if (projectRes.user_name !== currentUser.name) {console.log('2'); return -1}

  try {
    for (const project of projectRes.hackatime_projects) {
      const res = await fetch(
        `https://hackatime.hackclub.com/api/v1/users/${projectRes.user_name}/project/${project}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${currentUser.auth_token}` },
        }
      );

      if (!res.ok) return -1;

      const data = await res.json();
      hours += data.total_seconds;
    }
  } catch (e) {
    return -1;
  }

  return hours / 3600 - projectRes.total_hours;
}

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const project_id = searchParams.get("project_id");

  const cookieStore = await cookies();
  const session_id = cookieStore.get("session_id")?.value;
  if (!session_id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const hours = await getHours(session_id, project_id, cookieStore);
  console.log('hours', hours)
  if (hours === -1) return NextResponse.json({ error: "failed to fetch hours" }, { status: 400 });

  return NextResponse.json({ hours });
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session_id = cookieStore.get("session_id")?.value;
  if (!session_id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const supabase = createClient(cookieStore);

  const formData = await request.formData();
  const project_id = formData.get("project_id");
  const devlog_texts = formData.get("devlog_texts");
  const images = formData.getAll("devlog_images");

  const uploaded_urls = await Promise.all(
    images.map(async (image) => {
      const cdnForm = new FormData();
      cdnForm.append("file", image);

      const cdnRes = await fetch("https://cdn.hackclub.com/api/v4/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.CDN_KEY}` },
        body: cdnForm,
      });

      if (!cdnRes.ok) return null;

      const cdnData = await cdnRes.json();
      return cdnData.url;
    })
  );

  const devlog_images = uploaded_urls.filter(Boolean);

  const hours = await getHours(session_id, project_id, cookieStore);
  if (hours === -1) return NextResponse.json({ error: "failed to fetch hours" }, { status: 400 });

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("devlogs, total_hours, unpaid_hours")
    .eq("id", project_id)
    .single();

  if (fetchError || !project) {
    return NextResponse.json({ error: "project not found" }, { status: 404 });
  }

  const total_hours = project.total_hours + hours;
  const unpaid_hours = project.unpaid_hours + hours;

  const existingDevlogs = Array.isArray(project.devlogs) ? project.devlogs : [];

  const newEntry = {
    devlog_texts: devlog_texts ?? null,
    devlog_images: devlog_images.length > 0 ? devlog_images : null,
    hours,
  };

  const updatedDevlogs = [...existingDevlogs, newEntry];

  const { error: updateError } = await supabase
    .from("projects")
    .update({ devlogs: updatedDevlogs, total_hours, unpaid_hours })
    .eq("id", project_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, hours });
}