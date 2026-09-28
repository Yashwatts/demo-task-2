import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

dotenv.config();

export const typeOrmConfig: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/domain/*.entity.js'],
  migrations: ['dist/infrastructure/database/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
  seeds: ['dist/infrastructure/database/seeders/*.js'],
};

export default typeOrmConfig;
