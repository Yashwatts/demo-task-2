import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class ApplicantProfilesTable1790572791348 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'applicant_profiles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'years_of_experience',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'skills',
            type: 'text',
            isArray: true,
            default: "'{}'",
          },
          {
            name: 'resume_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'about_me',
            type: 'text',
            isNullable: true,
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
      'applicant_profiles',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('applicant_profiles', 'user_id');
    await queryRunner.dropTable('applicant_profiles');
  }
}
