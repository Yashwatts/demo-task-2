import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class JobsTable1790573072888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'department',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'employment_type',
            type: 'enum',
            enum: ['full_time', 'part_time', 'contract', 'internship'],
            default: "'full_time'",
          },
          {
            name: 'minimum_experience',
            type: 'int',
            default: 0,
          },
          {
            name: 'required_skills',
            type: 'text',
            isArray: true,
            default: "'{}'",
          },
          {
            name: 'application_deadline',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['open', 'closed'],
            default: "'open'",
          },
          {
            name: 'created_by_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jobs');
  }
}
