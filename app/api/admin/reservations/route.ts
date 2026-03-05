import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reservations } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_TOKEN}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const items = await db.select().from(reservations).orderBy(reservations.createdAt);
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_TOKEN}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, status } = await req.json();
        await db.update(reservations).set({ status }).where(eq(reservations.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
