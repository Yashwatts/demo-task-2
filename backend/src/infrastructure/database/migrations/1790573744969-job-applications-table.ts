import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class JobApplicationsTable1790573744969 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'job_applications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'job_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'applicant_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
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
            default: "'applied'",
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
    await queryRunner.createUniqueConstraint(
      'job_applications',
      new TableUnique({
        name: 'UQ_job_applicant',
        columnNames: ['job_id', 'applicant_id'],
      }),
    );
    await queryRunner.createForeignKey(
      'job_applications',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'job_applications',
      new TableForeignKey({
        columnNames: ['applicant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('job_applications');
  }
}
