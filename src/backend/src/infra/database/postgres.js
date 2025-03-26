import pg from "pg";
const { Pool } = pg

const pool = new Pool({
  user: "admin",
  host: "postgres",
  database: "nintendin",
  password: "123456",
  port: 5432,
  max: 10, // max number of connections
  idleTimeoutMillis: 30000, // close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection not successful
});

export default pool;