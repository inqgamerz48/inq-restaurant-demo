const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    const { category } = req.query;
    let items;
    if (category) {
        items = db.prepare('SELECT * FROM menu_items WHERE category = ? ORDER BY sort_order').all(category);
    } else {
        items = db.prepare('SELECT * FROM menu_items ORDER BY category, sort_order').all();
    }
    res.json(items);
});

router.get('/grouped', (req, res) => {
    const items = db.prepare('SELECT * FROM menu_items ORDER BY sort_order').all();
    const grouped = {};
    items.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
    });
    res.json(grouped);
});

router.get('/:id', (req, res) => {
    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
});

router.post('/', (req, res) => {
    const { category, name, price, description, tag, image_url, sort_order } = req.body;
    if (!category || !name || !price || !description) {
        return res.status(400).json({ error: 'category, name, price, and description are required' });
    }
    const result = db.prepare(`
    INSERT INTO menu_items (category, name, price, description, tag, image_url, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(category, name, price, description, tag || '', image_url || '', sort_order || 0);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Menu item created' });
});

router.put('/:id', (req, res) => {
    const { category, name, price, description, tag, image_url, sort_order } = req.body;
    const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Menu item not found' });

    db.prepare(`
    UPDATE menu_items SET category=?, name=?, price=?, description=?, tag=?, image_url=?, sort_order=?
    WHERE id=?
  `).run(
        category || existing.category, name || existing.name, price || existing.price,
        description || existing.description, tag ?? existing.tag, image_url ?? existing.image_url,
        sort_order ?? existing.sort_order, req.params.id
    );
    res.json({ message: 'Menu item updated' });
});

router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
});

module.exports = router;
