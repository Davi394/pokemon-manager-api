import { AppError } from '@domain/errors/app.error';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';

export class DeletePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string): Promise<void> {
    const pokemonExists = await this.pokemonRepository.findById(id);

    if (!pokemonExists) {
      throw new AppError('Pokémon não encontrado no catálogo.', 404);
    }

    await this.pokemonRepository.delete(id);
  }
}
