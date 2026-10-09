import { Trainer } from '@domain/entities/trainer';
import { ConflictError } from '@domain/errors/conflict.error';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';

interface CreateTrainerDTO {
  name: string;
  email: string;
  city: string;
}

export class CreateTrainerUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(data: CreateTrainerDTO): Promise<Trainer> {
    const trainerAlreadyExists = await this.trainerRepository.findByEmail(
      data.email,
    );

    if (trainerAlreadyExists) {
      throw new ConflictError(
        'Já existe um treinador cadastrado com este e-mail.',
      );
    }

    const trainer = new Trainer(data);

    await this.trainerRepository.create(trainer);

    return trainer;
  }
}
