import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterService } from './register';

describe('register service', () => {
  const createUser = {
    name: 'Jon Snow',
    email: 'isComing@winter.com',
    password: 'direwolves',
  };

  it('should create a new user', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute(createUser);

    expect(user.id).toEqual(expect.any(String));
    expect(user.email).toBe(createUser.email);
    expect(user.name).toBe(createUser.name);
    expect(user.created_at).toEqual(expect.any(Date));
    expect(user.password_hash).toEqual(expect.any(String));
  });

  it('should hash user password when registering a new user', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute(createUser);

    const isPasswordHashed = await compare(
      createUser.password,
      user.password_hash,
    );

    expect(isPasswordHashed).toBeTruthy();
  });

  it('should not be able to register a new user with duplicated email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    await registerService.execute(createUser);

    await expect(() =>
      registerService.execute({ ...createUser, name: 'Rob Stark' }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
