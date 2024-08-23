import { UsersRepository } from '@/repositories/users-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { compare } from 'bcryptjs';
import { User } from '@prisma/client';

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateServiceResponse {
  user: User;
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const findUserByEmail = await this.usersRepository.findByEmail(email);

    if (!findUserByEmail) throw new InvalidCredentialsError();

    const isMatchingPassword = await compare(
      password,
      findUserByEmail.password_hash,
    );

    if (!isMatchingPassword) throw new InvalidCredentialsError();

    return { user: findUserByEmail };
  }
}
