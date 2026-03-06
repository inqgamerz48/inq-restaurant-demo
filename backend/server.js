const express = require('express');
const cors = require('cors');
const path = require('path');

require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/menu', require('./routes/menu'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/hours', require('./routes/hours'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Restaurant CMS', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`\n  🔥 Restaurant CMS Backend running at http://localhost:${PORT}`);
    console.log(`  📋 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`  📡 API:         http://localhost:${PORT}/api/\n`);
});
