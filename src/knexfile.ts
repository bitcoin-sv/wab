import path from "path";
import { Knex } from "knex";

const connectionConfig = {
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "postgres",
    host: process.env.DB_HOST || '',
};

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "sqlite3",
        connection: { filename: "./dev.sqlite3" },
        useNullAsDefault: true
    },
    test: {
        client: "sqlite3",
        connection: ":memory:",
        useNullAsDefault: true,
        migrations: {
            directory: path.resolve(__dirname, "src/db/migrations")
        }
    },
    production: {
        client: process.env.DB_CLIENT || "mysql",
        connection: connectionConfig,
        pool: { min: 2, max: 10 },
        migrations: {
            tableName: "knex_migrations"
        }
    }
};

export default config;
