import { Capture } from '@domain/entities/capture';
import { ICaptureRepository } from '@domain/repositories/capture.repository';
import { Capture as PrismaCapture } from '@prisma/client';
import { prisma } from './client';

export class PrismaCaptureRepository implements ICaptureRepository {
  async create(capture: Capture): Promise<void> {
    await prisma.capture.create({
      data: {
        id: capture.id,
        trainerId: capture.trainerId,
        pokedexId: capture.pokedexId,
        name: capture.name,
        types: capture.types,
        sprite: capture.sprite,
        hp: capture.stats.hp,
        attack: capture.stats.attack,
        defense: capture.stats.defense,
        specialAttack: capture.stats.specialAttack,
        specialDefense: capture.stats.specialDefense,
        speed: capture.stats.speed,
        capturedAt: capture.capturedAt,
      },
    });
  }

  async countByTrainerId(trainerId: string): Promise<number> {
    return prisma.capture.count({ where: { trainerId } });
  }

  async findByTrainerId(trainerId: string): Promise<Capture[]> {
    const capturesRaw = await prisma.capture.findMany({
      where: { trainerId },
      orderBy: { capturedAt: 'asc' },
    });

    return capturesRaw.map((captureRaw) => this.toDomain(captureRaw));
  }

  // Converte a linha do banco (colunas soltas) na entidade (stats agrupados)
  private toDomain(captureRaw: PrismaCapture): Capture {
    return new Capture({
      id: captureRaw.id,
      trainerId: captureRaw.trainerId,
      pokedexId: captureRaw.pokedexId,
      name: captureRaw.name,
      types: captureRaw.types,
      sprite: captureRaw.sprite,
      stats: {
        hp: captureRaw.hp,
        attack: captureRaw.attack,
        defense: captureRaw.defense,
        specialAttack: captureRaw.specialAttack,
        specialDefense: captureRaw.specialDefense,
        speed: captureRaw.speed,
      },
      capturedAt: captureRaw.capturedAt,
    });
  }
}
