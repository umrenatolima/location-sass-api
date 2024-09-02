import { CheckInsRepository } from '@/repositories/check-ins-respository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInService } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: CheckInsRepository;
let sut: CheckInService;

describe('checkin service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a new check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'desert-1',
      userId: 'dothraki-rider-135',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to create two new check ins in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'kings-landing-1',
      userId: 'gold-cloak-235',
    });

    await expect(() =>
      sut.execute({
        gymId: 'kings-landing-1',
        userId: 'gold-cloak-235',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in different dates', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'kings-landing-1',
      userId: 'gold-cloak-235',
    });

    vi.setSystemTime(new Date(2024, 1, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'kings-landing-1',
      userId: 'gold-cloak-235',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
