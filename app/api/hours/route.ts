import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hours } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const items = await db.select().from(hours).orderBy(asc(hours.sortOrder));
        return NextResponse.json(items);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch hours' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { day_range, time, note, sort_order } = body;
        
        if (!day_range || !time) {
            return NextResponse.json({ error: 'day_range and time are required' }, { status: 400 });
        }
        
        const result = await db.insert(hours).values({
            dayRange: day_range,
            time: time,
            note: note || '',
            sortOrder: sort_order || 0
        }).returning({ id: hours.id });
        
        return NextResponse.json({ id: result[0].id, message: 'Hours entry created' }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create hours entry' }, { status: 500 });
    }
}
