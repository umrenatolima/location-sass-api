import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserProfileService } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe('get-user-profile service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  });

  it('should get a user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Jon Snow',
      email: 'isComing@winter.com',
      password_hash: await hash('direwolves', 6),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.name).toEqual(createdUser.name);
    expect(user.email).toEqual(createdUser.email);
  });

  it('should not be able to get a user profile with non existant id', async () => {
    await expect(() =>
      sut.execute({ userId: 'rains-of-castemere' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
