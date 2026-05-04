import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";

export async function POST(request) {
    const user_name = 'SPJ'
    const supabase = createClient(await cookies());
    const {project_name, project_desc, project_demo, project_repo, hackatime_projects} = await request.json();

    const { data: project, error } = await supabase.from('projects').insert({project_name, project_desc, project_demo, project_repo, hackatime_projects, user_name}).select().single();
    if (error) {
        console.error("Error inserting project:", error);
        return new Response(JSON.stringify({ error: "Failed to create project" }), { status: 500 });
    }

    return new Response(JSON.stringify(project), { status: 200 });

}

export async function UPDATE(request) {
    const { id, project_name, project_desc, project_demo, project_repo, hackatime_projects } = await request.json();
    const supabase = createClient(await cookies());
    const { data: project, error } = await supabase.from('projects').update({ project_name, project_desc, project_demo, project_repo, hackatime_projects }).eq('id', id).select().single();
    if (error) {
        console.error("Error updating project:", error);
        return new Response(JSON.stringify({ error: "Failed to update project" }), { status: 500 });
    }
    return new Response(JSON.stringify(project), { status: 200 });
}

export async function DELETE(request) {
    const { id } = await request.json();
    const supabase = createClient(await cookies());

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
        console.error("Error deleting project:", error);
        return new Response(JSON.stringify({ error: "Failed to delete project" }), { status: 500 });
    }
    return new Response(JSON.stringify({ message: "Project deleted successfully" }), { status: 200 });
}