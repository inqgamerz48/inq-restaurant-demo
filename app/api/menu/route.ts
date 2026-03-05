import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { menuItems } from '@/lib/schema';

export async function GET() {
    try {
        const items = await db.select().from(menuItems).orderBy(menuItems.sortOrder);
        return NextResponse.json(items);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
    }
}
