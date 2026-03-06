const express = require('express');
const { db } = require('../db');
const { hours } = require('./schema');
const { eq, asc } = require('drizzle-orm');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const items = await db.select().from(hours).orderBy(asc(hours.sortOrder));
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { day_range, time, note, sort_order } = req.body;
        if (!day_range || !time) {
            return res.status(400).json({ error: 'day_range and time are required' });
        }
        const result = await db.insert(hours).values({
            dayRange: day_range,
            time: time,
            note: note || '',
            sortOrder: sort_order || 0
        }).returning({ id: hours.id });
        res.status(201).json({ id: result[0].id, message: 'Hours entry created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { day_range, time, note, sort_order } = req.body;
        const existing = await db.select().from(hours).where(eq(hours.id, parseInt(req.params.id)));
        if (!existing.length) return res.status(404).json({ error: 'Hours entry not found' });

        await db.update(hours).set({
            dayRange: day_range || existing[0].dayRange,
            time: time || existing[0].time,
            note: note ?? existing[0].note,
            sortOrder: sort_order ?? existing[0].sortOrder
        }).where(eq(hours.id, parseInt(req.params.id)));
        res.json({ message: 'Hours updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.delete(hours).where(eq(hours.id, parseInt(req.params.id)));
        res.json({ message: 'Hours entry deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
