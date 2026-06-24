import pool from './pool';
import { schema } from './schema';

async function migrate() {
  try {
    console.log('Starting database migration...');
    await pool.query(schema);
    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  }
}

migrate();
