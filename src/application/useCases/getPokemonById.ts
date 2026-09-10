import { Pokemon } from '@domain/entities/pokemon';
import { ResourceNotFoundError } from '@domain/errors/resource-not-found.error';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';

export class GetPokemonByIdUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findById(id);

    if (!pokemon) {
      throw new ResourceNotFoundError('Pokémon não encontrado no catálogo.');
    }

    return pokemon;
  }
}
