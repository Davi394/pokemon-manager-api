import { Capture } from '@domain/entities/capture';
import { Trainer } from '@domain/entities/trainer';
import { NotFoundError } from '@domain/errors/notFound.error';
import { ICaptureRepository } from '@domain/repositories/capture.repository';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';

interface GetTrainerTeamResult {
  trainer: Trainer;
  team: Capture[];
}

export class GetTrainerTeamUseCase {
  constructor(
    private trainerRepository: ITrainerRepository,
    private captureRepository: ICaptureRepository,
  ) {}

  async execute(trainerId: string): Promise<GetTrainerTeamResult> {
    const trainer = await this.trainerRepository.findById(trainerId);

    if (!trainer) {
      throw new NotFoundError('Treinador não encontrado.');
    }

    const team = await this.captureRepository.findByTrainerId(trainerId);

    return { trainer, team };
  }
}
