import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hours } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const item = await db.select().from(hours).where(eq(hours.id, parseInt(id)));
        
        if (!item.length) {
            return NextResponse.json({ error: 'Hours entry not found' }, { status: 404 });
        }
        
        return NextResponse.json(item[0]);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch hours' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        const existing = await db.select().from(hours).where(eq(hours.id, parseInt(id)));
        
        if (!existing.length) {
            return NextResponse.json({ error: 'Hours entry not found' }, { status: 404 });
        }
        
        const { day_range, time, note, sort_order } = body;
        
        await db.update(hours).set({
            dayRange: day_range || existing[0].dayRange,
            time: time || existing[0].time,
            note: note ?? existing[0].note,
            sortOrder: sort_order ?? existing[0].sortOrder
        }).where(eq(hours.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Hours updated' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update hours' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        await db.delete(hours).where(eq(hours.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Hours entry deleted' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to delete hours entry' }, { status: 500 });
    }
}
