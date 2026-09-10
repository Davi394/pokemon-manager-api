import { ResourceNotFoundError } from '@domain/errors/resource-not-found.error';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';

export class DeletePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string): Promise<void> {
    const pokemonExists = await this.pokemonRepository.findById(id);

    if (!pokemonExists) {
      throw new ResourceNotFoundError('Pokémon não encontrado no catálogo.');
    }

    await this.pokemonRepository.delete(id);
  }
}
