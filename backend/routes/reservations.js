const express = require('express');
const { db } = require('../db');
const { reservations } = require('./schema');
const { eq } = require('drizzle-orm');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        let items;
        if (status) {
            items = await db.select().from(reservations).where(eq(reservations.status, status));
        } else {
            items = await db.select().from(reservations);
        }
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await db.select().from(reservations).where(eq(reservations.id, parseInt(req.params.id)));
        if (!item.length) return res.status(404).json({ error: 'Reservation not found' });
        res.json(item[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, date, time, guests, occasion, special_requests } = req.body;
        if (!name || !email || !date || !time || !guests) {
            return res.status(400).json({ error: 'name, email, date, time, and guests are required' });
        }
        const result = await db.insert(reservations).values({
            name,
            email,
            date,
            time,
            guests,
            occasion: occasion || '',
            specialRequests: special_requests || ''
        }).returning({ id: reservations.id });
        res.status(201).json({ id: result[0].id, message: 'Reservation created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, email, date, time, guests, occasion, special_requests, status } = req.body;
        const existing = await db.select().from(reservations).where(eq(reservations.id, parseInt(req.params.id)));
        if (!existing.length) return res.status(404).json({ error: 'Reservation not found' });

        await db.update(reservations).set({
            name: name || existing[0].name,
            email: email || existing[0].email,
            date: date || existing[0].date,
            time: time || existing[0].time,
            guests: guests || existing[0].guests,
            occasion: occasion ?? existing[0].occasion,
            specialRequests: special_requests ?? existing[0].specialRequests,
            status: status ?? existing[0].status
        }).where(eq(reservations.id, parseInt(req.params.id)));
        res.json({ message: 'Reservation updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.delete(reservations).where(eq(reservations.id, parseInt(req.params.id)));
        res.json({ message: 'Reservation deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
