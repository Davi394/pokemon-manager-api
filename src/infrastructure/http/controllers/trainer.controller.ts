import { Request, Response } from 'express';
import { CreateTrainerUseCase } from '@application/useCases/createTrainer';
import { CapturePokemonUseCase } from '@application/useCases/capturePokemon';
import { GetTrainerTeamUseCase } from '@application/useCases/getTrainerTeam';
import { Capture } from '@domain/entities/capture';

export class TrainerController {
  constructor(
    private createTrainerUseCase: CreateTrainerUseCase,
    private capturePokemonUseCase: CapturePokemonUseCase,
    private getTrainerTeamUseCase: GetTrainerTeamUseCase,
  ) {}

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

  async capture(req: Request, res: Response): Promise<Response> {
    const trainerId = req.params.trainerId as string;
    const { pokemonName } = req.body;

    const capture = await this.capturePokemonUseCase.execute({
      trainerId,
      pokemonName,
    });

    return res.status(201).json({
      message: 'Pokémon capturado com sucesso!',
      data: this.formatCapture(capture),
    });
  }

  async team(req: Request, res: Response): Promise<Response> {
    const trainerId = req.params.trainerId as string;

    const { trainer, team } =
      await this.getTrainerTeamUseCase.execute(trainerId);

    return res.status(200).json({
      data: {
        trainer: {
          id: trainer.id,
          name: trainer.name,
        },
        total: team.length,
        team: team.map((capture) => this.formatCapture(capture)),
      },
    });
  }

  // Formato de saída de uma captura (reutilizado na listagem do time)
  private formatCapture(capture: Capture) {
    return {
      id: capture.id,
      trainerId: capture.trainerId,
      pokedexId: capture.pokedexId,
      name: capture.name,
      types: capture.types,
      sprite: capture.sprite,
      stats: capture.stats,
      capturedAt: capture.capturedAt,
    };
  }
}
