const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(__dirname, 'data', 'restaurant.db');
const db = new DatabaseSync(dbPath);

console.log('Connected to SQLite database');

db.exec('PRAGMA journal_mode = WAL;');

db.exec(`
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT NOT NULL,
    tag TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL,
    occasion TEXT,
    special_requests TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    rating INTEGER DEFAULT 5,
    text TEXT NOT NULL,
    initials TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_range TEXT NOT NULL,
    time TEXT NOT NULL,
    note TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

const checkMenu = db.prepare('SELECT COUNT(*) as count FROM menu_items').get();
if (checkMenu.count === 0) {
  console.log('Seeding initial menu data...');
  const insertMenu = db.prepare(`
    INSERT INTO menu_items (category, name, price, description, tag, image_url, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const menuData = [
    { c: 'Starters', img: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop&q=80', name: 'Smoked Burrata', price: '$22', desc: 'Cold-smoked over applewood, heirloom tomatoes, basil oil, sea salt flakes.', tag: "Chef's Pick" },
    { c: 'Starters', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80', name: 'Wagyu Tartare', price: '$28', desc: 'Hand-cut A5 wagyu, truffle aioli, crispy capers, sourdough crostini.', tag: 'Signature' },
    { c: 'Starters', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80', name: 'Ember Bisque', price: '$18', desc: 'Fire-roasted red pepper, smoked paprika cream, crispy shallots, chive oil.', tag: 'Vegetarian' },
    { c: 'Mains', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80', name: 'Dry-Aged Ribeye', price: '$68', desc: '45-day dry-aged prime ribeye, bone marrow butter, roasted garlic, truffle jus.', tag: 'Signature' },
    { c: 'Mains', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80', name: 'Wood-Grilled Salmon', price: '$48', desc: 'Scottish salmon over applewood, lemon beurre blanc, fennel, capers.', tag: 'Sustainable' },
    { c: 'Mains', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop&q=80', name: 'Mushroom Risotto', price: '$38', desc: 'Wild porcini, aged parmesan, black truffle shavings, crispy sage.', tag: 'Vegetarian' },
    { c: 'Desserts', img: 'https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?w=600&auto=format&fit=crop&q=80', name: 'Burnt Caramel Tart', price: '$16', desc: 'Salted caramel, dark chocolate ganache, hazelnut praline, vanilla cream.', tag: 'Classic' },
    { c: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=80', name: 'Smoked Tiramisu', price: '$18', desc: 'Cold-smoked mascarpone, espresso-soaked ladyfingers, cocoa, amaretto.', tag: "Chef's Pick" },
    { c: 'Desserts', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80', name: 'Seasonal Sorbet', price: '$12', desc: 'Three rotating flavors, each crafted from peak-season local fruits daily.', tag: 'Vegan' },
    { c: 'Drinks', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80', name: 'Ember Old Fashioned', price: '$22', desc: 'Smoked bourbon, demerara, Angostura bitters, expressed orange peel, cherry.', tag: 'House Special' },
    { c: 'Drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80', name: 'Ash & Tonic', price: '$18', desc: 'Activated charcoal gin, elderflower tonic, cucumber, lime, fresh herbs.', tag: 'Signature' },
    { c: 'Drinks', img: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&auto=format&fit=crop&q=80', name: 'Barolo 2018', price: '$24', desc: 'Powerful Nebbiolo from Piedmont. Dark cherry, tar, rose — aged 4 years in oak.', tag: 'Sommelier Pick' },
  ];
  db.exec('BEGIN IMMEDIATE;');
  menuData.forEach((m, idx) => insertMenu.run(m.c, m.name, m.price, m.desc, m.tag, m.img, idx));
  db.exec('COMMIT;');
}

const checkTesti = db.prepare('SELECT COUNT(*) as count FROM testimonials').get();
if (checkTesti.count === 0) {
  console.log('Seeding initial testimonials data...');
  const insertTesti = db.prepare(`
    INSERT INTO testimonials (name, role, rating, text, initials) VALUES (?, ?, ?, ?, ?)
  `);
  const tData = [
    { name: 'Jonathan Gold', role: 'Culinary Monthly', rating: 5, text: '"Ember & Ash redefines the steakhouse experience. The smoke integration is brilliant and subtle. A triumph."', initials: 'JG' },
    { name: 'Maria Santos', role: 'Local Guide, Level 6', rating: 5, text: '"The dry-aged ribeye is phenomenal, but don\'t sleep on the smoked burrata. Service was impeccable start to finish."', initials: 'MS' },
    { name: 'David Chen', role: 'Food & Wine Critic', rating: 5, text: '"A masterful display of elemental cooking. The way they handle fire transforms simple ingredients into poetry."', initials: 'DC' }
  ];
  db.exec('BEGIN IMMEDIATE;');
  tData.forEach(t => insertTesti.run(t.name, t.role, t.rating, t.text, t.initials));
  db.exec('COMMIT;');
}

const checkHours = db.prepare('SELECT COUNT(*) as count FROM hours').get();
if (checkHours.count === 0) {
  console.log('Seeding initial hours data...');
  const insertHour = db.prepare('INSERT INTO hours (day_range, time, note, sort_order) VALUES (?, ?, ?, ?)');
  db.exec('BEGIN IMMEDIATE;');
  insertHour.run('Wednesday—Sunday', '5:00 PM — 10:30 PM', 'Dinner Service', 0);
  insertHour.run('Friday & Saturday', '10:30 PM — 12:00 AM', 'Late Night Bites Archive', 1);
  insertHour.run('Monday & Tuesday', 'Closed', 'Gone foraging. See you soon.', 2);
  db.exec('COMMIT;');
}

module.exports = db;
