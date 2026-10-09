import { Request, Response } from 'express';
import { CreateTrainerUseCase } from '@application/useCases/createTrainer';

export class TrainerController {
  constructor(private createTrainerUseCase: CreateTrainerUseCase) {}

  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, city } = req.body;

    const trainer = await this.createTrainerUseCase.execute({
      name,
      email,
      city,
    });

    return res.status(201).json({
      message: 'Treinador cadastrado com sucesso!',
      data: {
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        city: trainer.city,
      },
    });
  }
}
