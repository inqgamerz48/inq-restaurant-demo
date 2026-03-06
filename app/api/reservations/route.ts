import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reservations } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        
        let items;
        if (status) {
            items = await db.select().from(reservations).where(eq(reservations.status, status));
        } else {
            items = await db.select().from(reservations);
        }
        return NextResponse.json(items);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
    }
}

const reservationSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    date: z.string(),
    time: z.string(),
    guests: z.coerce.number().min(1).max(20),
    occasion: z.string().optional(),
    specialRequests: z.string().optional()
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = reservationSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid data', details: parsed.error.format() }, { status: 400 });
        }

        const newReservation = await db.insert(reservations).values({
            name: parsed.data.name,
            email: parsed.data.email,
            date: parsed.data.date,
            time: parsed.data.time,
            guests: parsed.data.guests,
            occasion: parsed.data.occasion || '',
            specialRequests: parsed.data.specialRequests || '',
            status: 'pending'
        }).returning();

        return NextResponse.json({ success: true, data: newReservation[0] }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to submit reservation' }, { status: 500 });
    }
}
