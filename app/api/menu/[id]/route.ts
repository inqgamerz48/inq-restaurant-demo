import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { menuItems } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const item = await db.select().from(menuItems).where(eq(menuItems.id, parseInt(id)));
        
        if (!item.length) {
            return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
        }
        
        return NextResponse.json(item[0]);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch menu item' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        const existing = await db.select().from(menuItems).where(eq(menuItems.id, parseInt(id)));
        
        if (!existing.length) {
            return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
        }
        
        const { category, name, price, description, tag, image_url, sort_order } = body;
        
        await db.update(menuItems).set({
            category: category || existing[0].category,
            name: name || existing[0].name,
            price: price || existing[0].price,
            description: description || existing[0].description,
            tag: tag ?? existing[0].tag,
            imageUrl: image_url ?? existing[0].imageUrl,
            sortOrder: sort_order ?? existing[0].sortOrder
        }).where(eq(menuItems.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Menu item updated' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        await db.delete(menuItems).where(eq(menuItems.id, parseInt(id)));
        
        return NextResponse.json({ message: 'Menu item deleted' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
    }
}
