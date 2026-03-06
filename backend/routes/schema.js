const { pgTable, text, serial, integer, timestamp } = require('drizzle-orm/pg-core');

const menuItems = pgTable('menu_items', {
    id: serial('id').primaryKey(),
    category: text('category').notNull(),
    name: text('name').notNull(),
    price: text('price').notNull(),
    description: text('description').notNull(),
    tag: text('tag'),
    imageUrl: text('image_url'),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at').defaultNow()
});

const reservations = pgTable('reservations', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    date: text('date').notNull(),
    time: text('time').notNull(),
    guests: integer('guests').notNull(),
    occasion: text('occasion'),
    specialRequests: text('special_requests'),
    status: text('status').default('pending'),
    createdAt: timestamp('created_at').defaultNow()
});

const testimonials = pgTable('testimonials', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    role: text('role'),
    rating: integer('rating').default(5),
    text: text('text').notNull(),
    initials: text('initials').notNull(),
    active: integer('active').default(1),
    createdAt: timestamp('created_at').defaultNow()
});

const hours = pgTable('hours', {
    id: serial('id').primaryKey(),
    dayRange: text('day_range').notNull(),
    time: text('time').notNull(),
    note: text('note'),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at').defaultNow()
});

const settings = pgTable('settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
    updatedAt: timestamp('updated_at').defaultNow()
});

module.exports = {
    menuItems,
    reservations,
    testimonials,
    hours,
    settings
};
