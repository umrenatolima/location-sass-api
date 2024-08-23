import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterService, RegisterServiceRequest } from './register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterService;
let newUser: RegisterServiceRequest;

describe('register service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterService(usersRepository);

    newUser = {
      name: 'Jon Snow',
      email: 'isComing@winter.com',
      password: 'direwolves',
    };
  });

  it('should create a new user', async () => {
    const { user } = await sut.execute(newUser);

    expect(user.id).toEqual(expect.any(String));
    expect(user.email).toBe(newUser.email);
    expect(user.name).toBe(newUser.name);
    expect(user.created_at).toEqual(expect.any(Date));
    expect(user.password_hash).toEqual(expect.any(String));
  });

  it('should hash user password when registering a new user', async () => {
    const { user } = await sut.execute(newUser);

    const isPasswordHashed = await compare(
      newUser.password,
      user.password_hash,
    );

    expect(isPasswordHashed).toBeTruthy();
  });

  it('should not be able to register a new user with duplicated email', async () => {
    await sut.execute(newUser);

    await expect(() =>
      sut.execute({ ...newUser, name: 'Rob Stark' }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
