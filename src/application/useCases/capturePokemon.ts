import { Capture, MAX_ACTIVE_TEAM_SIZE } from '@domain/entities/capture';
import { ConflictError } from '@domain/errors/conflict.error';
import { NotFoundError } from '@domain/errors/notFound.error';
import { IPokeApiGateway } from '@domain/gateways/pokeApi.gateway';
import { ICaptureRepository } from '@domain/repositories/capture.repository';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';

interface CapturePokemonDTO {
  trainerId: string;
  pokemonName: string;
}

export class CapturePokemonUseCase {
  constructor(
    private trainerRepository: ITrainerRepository,
    private captureRepository: ICaptureRepository,
    private pokeApiGateway: IPokeApiGateway,
  ) {}

  async execute({
    trainerId,
    pokemonName,
  }: CapturePokemonDTO): Promise<Capture> {
    // 1. O treinador precisa existir
    const trainer = await this.trainerRepository.findById(trainerId);

    if (!trainer) {
      throw new NotFoundError('Treinador não encontrado.');
    }

    // 2. Regra de negócio: no máximo 6 Pokémons no time ativo
    const teamSize = await this.captureRepository.countByTrainerId(trainerId);

    if (teamSize >= MAX_ACTIVE_TEAM_SIZE) {
      throw new ConflictError(
        `O treinador já possui o limite máximo de ${MAX_ACTIVE_TEAM_SIZE} Pokémons em seu time`,
      );
    }

    // 3. Dados oficiais (imagem, atributos base e tipos) vindos da PokéAPI
    const pokemonData = await this.pokeApiGateway.findByName(pokemonName);

    if (!pokemonData) {
      throw new NotFoundError(
        `Pokémon "${pokemonName}" não encontrado na PokéAPI.`,
      );
    }

    // 4. Salva a captura associada ao treinador
    const capture = new Capture({
      trainerId,
      pokedexId: pokemonData.pokedexId,
      name: pokemonData.name,
      types: pokemonData.types,
      sprite: pokemonData.sprite,
      stats: pokemonData.stats,
    });

    await this.captureRepository.create(capture);

    return capture;
  }
}
