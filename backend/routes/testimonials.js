const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    const { active } = req.query;
    let items;
    if (active !== undefined) {
        items = db.prepare('SELECT * FROM testimonials WHERE active = ? ORDER BY created_at DESC').all(parseInt(active));
    } else {
        items = db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all();
    }
    res.json(items);
});

router.get('/:id', (req, res) => {
    const item = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(item);
});

router.post('/', (req, res) => {
    const { name, role, rating, text, initials } = req.body;
    if (!name || !text) {
        return res.status(400).json({ error: 'name and text are required' });
    }
    const result = db.prepare(`
    INSERT INTO testimonials (name, role, rating, text, initials)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, role || '', rating || 5, text, initials || name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase());
    res.status(201).json({ id: result.lastInsertRowid, message: 'Testimonial created' });
});

router.put('/:id', (req, res) => {
    const { name, role, rating, text, initials, active } = req.body;
    const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Testimonial not found' });

    db.prepare(`
    UPDATE testimonials SET name=?, role=?, rating=?, text=?, initials=?, active=?
    WHERE id=?
  `).run(
        name || existing.name, role ?? existing.role, rating ?? existing.rating,
        text || existing.text, initials ?? existing.initials, active ?? existing.active, req.params.id
    );
    res.json({ message: 'Testimonial updated' });
});

router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted' });
});

module.exports = router;
