import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class ApplicationsStatusHistoriesTable1790574403831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'applications_status_histories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'application_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'previous_status',
            type: 'enum',
            enum: [
              'applied',
              'shortlisted',
              'interview',
              'offer',
              'hired',
              'rejected',
              'withdrawn',
            ],
            isNullable: true,
          },
          {
            name: 'new_status',
            type: 'enum',
            enum: [
              'applied',
              'shortlisted',
              'interview',
              'offer',
              'hired',
              'rejected',
              'withdrawn',
            ],
            isNullable: false,
          },
          {
            name: 'changed_by_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'changed_by_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'changed_by_role',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'note',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'applications_status_histories',
      new TableForeignKey({
        columnNames: ['application_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'job_applications',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('applications_status_histories');
  }
}
