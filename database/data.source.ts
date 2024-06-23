import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * This function will custom the environment variable for
 * loading DataSourceOptions then return a DataSourceOptions
 * when run migration
 * @returns DataSourceOptions
 */
function dynamicConfigDatabaseMyself(): DataSourceOptions {
    const envFilePath = path.resolve(process.cwd(), `.env.${dotenv.config().parsed.NODE_ENV}.local`);
    dotenv.config({ path: envFilePath });
    return {
        type: 'postgres',
        host: process.env.PGHOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/database/migrations/*.js'],
        ssl: {
            rejectUnauthorized: false,
        },
    };
}

export const dataSourceOptions: DataSourceOptions = dynamicConfigDatabaseMyself();

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;