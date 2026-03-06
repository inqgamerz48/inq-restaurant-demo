import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { menuItems } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        
        let items;
        if (category) {
            items = await db.select().from(menuItems).where(eq(menuItems.category, category)).orderBy(asc(menuItems.sortOrder));
        } else {
            items = await db.select().from(menuItems).orderBy(asc(menuItems.sortOrder));
        }
        return NextResponse.json(items);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category, name, price, description, tag, image_url, sort_order } = body;
        
        if (!category || !name || !price || !description) {
            return NextResponse.json({ error: 'category, name, price, and description are required' }, { status: 400 });
        }
        
        const result = await db.insert(menuItems).values({
            category,
            name,
            price,
            description,
            tag: tag || '',
            imageUrl: image_url || '',
            sortOrder: sort_order || 0
        }).returning({ id: menuItems.id });
        
        return NextResponse.json({ id: result[0].id, message: 'Menu item created' }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
    }
}
