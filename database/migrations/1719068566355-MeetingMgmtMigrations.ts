import { MigrationInterface, QueryRunner } from "typeorm";

export class MeetingMgmtMigrations1719068566355 implements MigrationInterface {
    name = 'MeetingMgmtMigrations1719068566355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "usermeetings" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "public_id"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "public_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "created_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "updated_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "public_id"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "public_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "created_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "updated_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "tag"`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "tag" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usermeetings" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usermeetings" DROP COLUMN "meeting_id"`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ADD "meeting_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usermeetings" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ADD "created_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usermeetings" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ADD "updated_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_a880053474a7d836c126be542b9" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("meeting_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD CONSTRAINT "FK_2b8bd176239d5ab82a4df1e1feb" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("meeting_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP CONSTRAINT "FK_2b8bd176239d5ab82a4df1e1feb"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_a880053474a7d836c126be542b9"`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "usermeetings" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ADD "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "usermeetings" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ADD "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "usermeetings" DROP COLUMN "meeting_id"`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ADD "meeting_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usermeetings" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetings" DROP COLUMN "tag"`);
        await queryRunner.query(`ALTER TABLE "meetings" ADD "tag" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "public_id"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "public_id" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "link" character varying(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "link" character varying(1000)`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "type" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "public_id"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "public_id" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usermeetings" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "meetingminutes" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "files" ADD "deleted_at" TIMESTAMP`);
    }

}
