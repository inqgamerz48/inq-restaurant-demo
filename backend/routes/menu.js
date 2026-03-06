const express = require('express');
const { db } = require('../db');
const { menuItems } = require('./schema');
const { eq, asc } = require('drizzle-orm');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let items;
        if (category) {
            items = await db.select().from(menuItems).where(eq(menuItems.category, category)).orderBy(asc(menuItems.sortOrder));
        } else {
            items = await db.select().from(menuItems).orderBy(asc(menuItems.sortOrder));
        }
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/grouped', async (req, res) => {
    try {
        const items = await db.select().from(menuItems).orderBy(asc(menuItems.sortOrder));
        const grouped = {};
        items.forEach(item => {
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push(item);
        });
        res.json(grouped);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await db.select().from(menuItems).where(eq(menuItems.id, parseInt(req.params.id)));
        if (!item.length) return res.status(404).json({ error: 'Menu item not found' });
        res.json(item[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { category, name, price, description, tag, image_url, sort_order } = req.body;
        if (!category || !name || !price || !description) {
            return res.status(400).json({ error: 'category, name, price, and description are required' });
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
        res.status(201).json({ id: result[0].id, message: 'Menu item created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { category, name, price, description, tag, image_url, sort_order } = req.body;
        const existing = await db.select().from(menuItems).where(eq(menuItems.id, parseInt(req.params.id)));
        if (!existing.length) return res.status(404).json({ error: 'Menu item not found' });

        await db.update(menuItems).set({
            category: category || existing[0].category,
            name: name || existing[0].name,
            price: price || existing[0].price,
            description: description || existing[0].description,
            tag: tag ?? existing[0].tag,
            imageUrl: image_url ?? existing[0].imageUrl,
            sortOrder: sort_order ?? existing[0].sortOrder
        }).where(eq(menuItems.id, parseInt(req.params.id)));
        res.json({ message: 'Menu item updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.delete(menuItems).where(eq(menuItems.id, parseInt(req.params.id)));
        if (!result) return res.status(404).json({ error: 'Menu item not found' });
        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
