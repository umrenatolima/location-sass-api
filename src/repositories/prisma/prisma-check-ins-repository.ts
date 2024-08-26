import { prisma } from '@/lib/prisma';
import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-respository';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data });
    return checkIn;
  }
}
