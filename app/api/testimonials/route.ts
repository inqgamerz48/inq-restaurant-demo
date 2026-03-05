import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials } from '@/lib/schema';

export async function GET() {
    try {
        const items = await db.select().from(testimonials);
        return NextResponse.json(items);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}
