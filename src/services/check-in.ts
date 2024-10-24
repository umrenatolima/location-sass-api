import { CheckInsRepository } from '@/repositories/check-ins-respository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

interface CheckInRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInResponse {
  checkIn: CheckIn;
}

const MAX_DISTANCE_IN_KM = 0.1; // 100 meters

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInRequest): Promise<CheckInResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) throw new ResourceNotFoundError();

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    if (distance > MAX_DISTANCE_IN_KM) throw new Error();

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDate) throw new Error();

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}
