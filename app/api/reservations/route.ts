import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reservations } from '@/lib/schema';
import { z } from 'zod';

const reservationSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    date: z.string(),
    time: z.string(),
    guests: z.coerce.number().min(1).max(20),
    specialRequests: z.string().optional()
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
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
            specialRequests: parsed.data.specialRequests,
            status: 'pending'
        }).returning();

        return NextResponse.json({ success: true, data: newReservation[0] }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to submit reservation' }, { status: 500 });
    }
}
