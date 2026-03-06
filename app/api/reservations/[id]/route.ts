import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reservations } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const item = await db.select().from(reservations).where(eq(reservations.id, parseInt(id)));
        
        if (!item.length) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }
        
        return NextResponse.json(item[0]);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch reservation' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        const existing = await db.select().from(reservations).where(eq(reservations.id, parseInt(id)));
        
        if (!existing.length) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }
        
        const { name, email, date, time, guests, occasion, special_requests, status } = body;
        
        await db.update(reservations).set({
            name: name || existing[0].name,
            email: email || existing[0].email,
            date: date || existing[0].date,
            time: time || existing[0].time,
            guests: guests || existing[0].guests,
            occasion: occasion ?? existing[0].occasion,
            specialRequests: special_requests ?? existing[0].specialRequests,
            status: status ?? existing[0].status
        }).where(eq(reservations.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Reservation updated' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        await db.delete(reservations).where(eq(reservations.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Reservation deleted' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
    }
}
