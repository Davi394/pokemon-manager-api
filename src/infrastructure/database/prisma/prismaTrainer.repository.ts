import { Trainer } from '@domain/entities/trainer';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';
import { Trainer as PrismaTrainer } from '@prisma/client';
import { prisma } from './client';

export class PrismaTrainerRepository implements ITrainerRepository {
  async create(trainer: Trainer): Promise<void> {
    await prisma.trainer.create({
      data: {
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        city: trainer.city,
      },
    });
  }

  async findById(id: string): Promise<Trainer | null> {
    const trainerRaw = await prisma.trainer.findUnique({ where: { id } });

    if (!trainerRaw) return null;

    return this.toDomain(trainerRaw);
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    const trainerRaw = await prisma.trainer.findUnique({ where: { email } });

    if (!trainerRaw) return null;

    return this.toDomain(trainerRaw);
  }

  // Converte a linha do banco (tipo do Prisma) na entidade do Domínio
  private toDomain(trainerRaw: PrismaTrainer): Trainer {
    return new Trainer({
      id: trainerRaw.id,
      name: trainerRaw.name,
      email: trainerRaw.email,
      city: trainerRaw.city,
    });
  }
}
