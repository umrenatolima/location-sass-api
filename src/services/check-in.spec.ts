import { CheckInsRepository } from '@/repositories/check-ins-respository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CheckInService } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: CheckInsRepository;
let sut: CheckInService;

describe('checkin service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(checkInsRepository);
  });

  it('should create a new check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'desert-1',
      userId: 'dothraki-rider-135',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
