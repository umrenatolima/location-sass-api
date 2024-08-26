import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthenticateService } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe('authenticate service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(usersRepository);
  });

  it('should authenticate user via email and password', async () => {
    await usersRepository.create({
      name: 'Jon Snow',
      email: 'isComing@winter.com',
      password_hash: await hash('direwolves', 6),
    });

    const login = {
      email: 'isComing@winter.com',
      password: 'direwolves',
    };

    const { user } = await sut.execute(login);

    expect(user.email).toBe(login.email);
  });

  it('should not authenticate user with wrong email', async () => {
    const login = {
      email: 'isComing@winter.com',
      password: 'direwolves',
    };

    await expect(() => sut.execute(login)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Jon Snow',
      email: 'isComing@winter.com',
      password_hash: await hash('direwolves', 6),
    });

    const login = {
      email: 'isComing@winter.com',
      password: 'wrong-password',
    };

    await expect(() => sut.execute(login)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});
