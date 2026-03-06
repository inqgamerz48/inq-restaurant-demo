const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    const { status } = req.query;
    let items;
    if (status) {
        items = db.prepare('SELECT * FROM reservations WHERE status = ? ORDER BY date, time').all(status);
    } else {
        items = db.prepare('SELECT * FROM reservations ORDER BY date, time').all();
    }
    res.json(items);
});

router.get('/:id', (req, res) => {
    const item = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Reservation not found' });
    res.json(item);
});

router.post('/', (req, res) => {
    const { name, email, date, time, guests, occasion, special_requests } = req.body;
    if (!name || !email || !date || !time || !guests) {
        return res.status(400).json({ error: 'name, email, date, time, and guests are required' });
    }
    const result = db.prepare(`
    INSERT INTO reservations (name, email, date, time, guests, occasion, special_requests)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, email, date, time, guests, occasion || '', special_requests || '');
    res.status(201).json({ id: result.lastInsertRowid, message: 'Reservation created' });
});

router.put('/:id', (req, res) => {
    const { name, email, date, time, guests, occasion, special_requests, status } = req.body;
    const existing = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Reservation not found' });

    db.prepare(`
    UPDATE reservations SET name=?, email=?, date=?, time=?, guests=?, occasion=?, special_requests=?, status=?
    WHERE id=?
  `).run(
        name || existing.name, email || existing.email, date || existing.date,
        time || existing.time, guests || existing.guests, occasion ?? existing.occasion,
        special_requests ?? existing.special_requests, status ?? existing.status, req.params.id
    );
    res.json({ message: 'Reservation updated' });
});

router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM reservations WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Reservation not found' });
    res.json({ message: 'Reservation deleted' });
});

module.exports = router;
