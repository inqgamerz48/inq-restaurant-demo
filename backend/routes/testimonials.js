const express = require('express');
const { db } = require('../db');
const { testimonials } = require('./schema');
const { eq, desc } = require('drizzle-orm');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { active } = req.query;
        let items;
        if (active !== undefined) {
            items = await db.select().from(testimonials).where(eq(testimonials.active, parseInt(active))).orderBy(desc(testimonials.createdAt));
        } else {
            items = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
        }
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await db.select().from(testimonials).where(eq(testimonials.id, parseInt(req.params.id)));
        if (!item.length) return res.status(404).json({ error: 'Testimonial not found' });
        res.json(item[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, role, rating, text, initials } = req.body;
        if (!name || !text) {
            return res.status(400).json({ error: 'name and text are required' });
        }
        const result = await db.insert(testimonials).values({
            name,
            role: role || '',
            rating: rating || 5,
            text,
            initials: initials || name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        }).returning({ id: testimonials.id });
        res.status(201).json({ id: result[0].id, message: 'Testimonial created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, role, rating, text, initials, active } = req.body;
        const existing = await db.select().from(testimonials).where(eq(testimonials.id, parseInt(req.params.id)));
        if (!existing.length) return res.status(404).json({ error: 'Testimonial not found' });

        await db.update(testimonials).set({
            name: name || existing[0].name,
            role: role ?? existing[0].role,
            rating: rating ?? existing[0].rating,
            text: text || existing[0].text,
            initials: initials ?? existing[0].initials,
            active: active ?? existing[0].active
        }).where(eq(testimonials.id, parseInt(req.params.id)));
        res.json({ message: 'Testimonial updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.delete(testimonials).where(eq(testimonials.id, parseInt(req.params.id)));
        res.json({ message: 'Testimonial deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
