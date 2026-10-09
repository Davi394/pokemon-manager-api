import { CreateTrainerUseCase } from '@application/useCases/createTrainer';
import { PrismaTrainerRepository } from '@infrastructure/database/prisma/prismaTrainer.repository';
import { TrainerController } from '@infrastructure/http/controllers/trainer.controller';

const trainerRepository = new PrismaTrainerRepository();

export function makeTrainerController(): TrainerController {
  const createTrainerUseCase = new CreateTrainerUseCase(trainerRepository);

  return new TrainerController(createTrainerUseCase);
}
