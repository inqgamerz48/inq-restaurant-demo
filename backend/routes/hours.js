const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    const items = db.prepare('SELECT * FROM hours ORDER BY sort_order').all();
    res.json(items);
});

router.post('/', (req, res) => {
    const { day_range, time, note, sort_order } = req.body;
    if (!day_range || !time) {
        return res.status(400).json({ error: 'day_range and time are required' });
    }
    const result = db.prepare(`
    INSERT INTO hours (day_range, time, note, sort_order) VALUES (?, ?, ?, ?)
  `).run(day_range, time, note || '', sort_order || 0);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Hours entry created' });
});

router.put('/:id', (req, res) => {
    const { day_range, time, note, sort_order } = req.body;
    const existing = db.prepare('SELECT * FROM hours WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Hours entry not found' });

    db.prepare(`
    UPDATE hours SET day_range=?, time=?, note=?, sort_order=? WHERE id=?
  `).run(day_range || existing.day_range, time || existing.time, note ?? existing.note, sort_order ?? existing.sort_order, req.params.id);
    res.json({ message: 'Hours updated' });
});

router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM hours WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Hours entry not found' });
    res.json({ message: 'Hours entry deleted' });
});

module.exports = router;
