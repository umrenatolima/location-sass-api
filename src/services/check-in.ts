import { CheckInsRepository } from '@/repositories/check-ins-respository';
import { CheckIn } from '@prisma/client';

interface CheckInRequest {
  userId: string;
  gymId: string;
}

interface CheckInResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId, gymId }: CheckInRequest): Promise<CheckInResponse> {
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}
