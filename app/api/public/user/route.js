import {cookies} from 'next/headers';
import { createClient } from '@/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const supabase = createClient(await cookies());
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
        return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }
    const { data: userData, error } = await supabase
        .from('users')
        .select("id, created_at, name, hackclub_id, cookies, hours")
        .eq('id', user_id)
        .single();

    if (error) {
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }

    return NextResponse.json({ user: userData });
}