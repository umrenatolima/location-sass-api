import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { describe, it, expect } from 'vitest';
import { AuthenticateService } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('authenticate service', () => {
  it('should authenticate user via email and password', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

    const login = {
      email: 'isComing@winter.com',
      password: 'direwolves',
    };

    expect(() => sut.execute(login)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

    await usersRepository.create({
      name: 'Jon Snow',
      email: 'isComing@winter.com',
      password_hash: await hash('direwolves', 6),
    });

    const login = {
      email: 'isComing@winter.com',
      password: 'wrong-password',
    };

    expect(() => sut.execute(login)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});
