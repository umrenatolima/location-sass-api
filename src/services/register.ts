import { prisma } from '@/lib/prisma';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import { hash } from 'bcryptjs';

interface RegisterServiceRequest {
  name: string;
  email: string;
  password: string;
}

export async function registerService({
  name,
  email,
  password,
}: RegisterServiceRequest) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) throw new Error('Email already exists.');

  const password_hash = await hash(password, 6);

  const usersRepository = new PrismaUsersRepository();

  await usersRepository.create({ name, email, password_hash });
}
