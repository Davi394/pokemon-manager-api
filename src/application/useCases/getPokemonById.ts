import { Pokemon } from '@domain/entities/pokemon';
import { AppError } from '@domain/errors/app.error';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';

export class GetPokemonByIdUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findById(id);

    if (!pokemon) {
      throw new AppError('Pokémon não encontrado no catálogo.', 404);
    }

    return pokemon;
  }
}
