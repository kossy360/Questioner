import { Pool } from 'pg';
import text from './db.sql';

const pool = new Pool();

export default pool;
