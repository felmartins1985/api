import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRoleColumn1779218480278 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users MODIFY COLUMN role tinyint NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users MODIFY COLUMN role varchar(255) NOT NULL DEFAULT '1'`,
    );
  }
}
