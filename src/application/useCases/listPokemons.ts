import { Pokemon } from '@domain/entities/pokemon';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';

interface ListPokemonsDTO {
  type?: string;
}

export class ListPokemonsUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(data?: ListPokemonsDTO): Promise<Pokemon[]> {
    if (data?.type) {
      return await this.pokemonRepository.findByType(data.type);
    }

    return await this.pokemonRepository.findAll();
  }
}
