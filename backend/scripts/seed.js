import { db, initializeDatabase } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Initialize database tables
initializeDatabase();

// Test users
const testUsers = [
  {
    email: 'demo@example.com',
    password: 'demo123456',
    name: 'Demo User'
  },
  {
    email: 'admin@example.com',
    password: 'admin123456',
    name: 'Admin User'
  },
  {
    email: 'test@example.com',
    password: 'test123456',
    name: 'Test User'
  }
];

// Insert test users
try {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, password, name)
    VALUES (?, ?, ?, ?)
  `);

  testUsers.forEach(user => {
    const userId = uuidv4();
    stmt.run(userId, user.email, user.password, user.name);
    console.log(`✓ Created user: ${user.email}`);
  });

  console.log('\n✓ Seed completed successfully');
  console.log('\nTest credentials:');
  testUsers.forEach(user => {
    console.log(`  - Email: ${user.email}, Password: ${user.password}`);
  });

} catch (error) {
  console.error('✗ Seed error:', error.message);
  process.exit(1);
}
