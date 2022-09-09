import * as argon from 'argon2';

import { ConfigService } from '@nestjs/config';

import { PrismaService } from './prisma/prisma.service';

/**
 * Not a test suite, but functionality that supports writing test cases.
 * Simplifies operations on the database during tests.
 */
export class DbTestUtils {
  private static _instance: DbTestUtils;
  private db: PrismaService;

  private constructor() {
    const config = new ConfigService();
    this.db = new PrismaService(config);
  }

  public static getInstance(): DbTestUtils {
    if (!DbTestUtils._instance) {
      DbTestUtils._instance = new DbTestUtils();
    }
    return DbTestUtils._instance;
  }

  public async wipeDb() {
    await this.db.repository.deleteMany();
    await this.db.user.deleteMany();
  }

  /**
   * Creates a new user.
   */
  public async createTestUser(id: string, name: string, email: string, pw: string) {
    // Isn't required to be the exact hash function, which is also used in production code
    const hash = await argon.hash(pw);

    const user = await this.db.user.create({
      data: {
        id: id,
        name: name,
        email: email,
        pw: hash,
      },
    });

    return user;
  }

  /**
   * Creates a new repository for an existing user.
   */
  async createTestRepository(
    userId: string,
    repoName: string,
    version?: string,
    description?: string,
    taxonomy?: string,
  ) {
    const repository = await this.db.repository.create({
      data: {
        userId: userId,
        name: repoName,
        version: version,
        description: description,
        taxonomy: taxonomy,
      },
    });

    return repository;
  }
}