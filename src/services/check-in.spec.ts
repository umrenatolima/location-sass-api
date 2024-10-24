import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInService } from './check-in';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe('checkin service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: 'kings-landing-1',
      title: 'westeros-capital',
      description: 'capital of the continent of westeros.',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: '0123456789',
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a new check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'kings-landing-1',
      userId: 'dothraki-rider-135',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to create two new check ins in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'kings-landing-1',
      userId: 'gold-cloak-235',
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: 'kings-landing-1',
        userId: 'gold-cloak-235',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in different dates', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'kings-landing-1',
      userId: 'gold-cloak-235',
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2024, 1, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'kings-landing-1',
      userId: 'gold-cloak-235',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in distant gym', async () => {
    gymsRepository.items.push({
      id: 'big-ben',
      title: 'Big Ben Tower',
      description: '16-story Gothic clock tower.',
      latitude: new Decimal(51.50082935296116),
      longitude: new Decimal(-0.12463613039419467),
      phone: '0123456789',
    });

    await expect(() =>
      sut.execute({
        gymId: 'big-ben',
        userId: 'gold-cloak-235',
        userLatitude: 51.5193643472522,
        userLongitude: -0.12681777292955201,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
