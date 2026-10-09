// src/main/factories/makeTrainerController.factory.ts
import { CreateTrainerUseCase } from '@application/useCases/createTrainer';
import { CapturePokemonUseCase } from '@application/useCases/capturePokemon';
import { GetTrainerTeamUseCase } from '@application/useCases/getTrainerTeam';
import { PrismaTrainerRepository } from '@infrastructure/database/prisma/prismaTrainer.repository';
import { PrismaCaptureRepository } from '@infrastructure/database/prisma/prismaCapture.repository';
import { TrainerController } from '@infrastructure/http/controllers/trainer.controller';
import { FetchPokeApiGateway } from '@infrastructure/providers/fetchPokeApi.gateway';

const trainerRepository = new PrismaTrainerRepository();
const captureRepository = new PrismaCaptureRepository();
const pokeApiGateway = new FetchPokeApiGateway();

export function makeTrainerController(): TrainerController {
  const createTrainerUseCase = new CreateTrainerUseCase(trainerRepository);
  const capturePokemonUseCase = new CapturePokemonUseCase(
    trainerRepository,
    captureRepository,
    pokeApiGateway,
  );
  const getTrainerTeamUseCase = new GetTrainerTeamUseCase(
    trainerRepository,
    captureRepository,
  );

  return new TrainerController(
    createTrainerUseCase,
    capturePokemonUseCase,
    getTrainerTeamUseCase,
  );
}
