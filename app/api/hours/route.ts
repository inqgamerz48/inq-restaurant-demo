import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hours } from '@/lib/schema';

export async function GET() {
    try {
        const items = await db.select().from(hours).orderBy(hours.sortOrder);
        return NextResponse.json(items);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch hours' }, { status: 500 });
    }
}
