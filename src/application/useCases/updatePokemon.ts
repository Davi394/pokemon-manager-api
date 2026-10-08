import { Pokemon } from '@domain/entities/pokemon';
import { NotFoundError } from '@domain/errors/notFound.error';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';

interface UpdatePokemonDTO {
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
}

export class UpdatePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string, data: UpdatePokemonDTO): Promise<Pokemon> {
    const pokemonExists = await this.pokemonRepository.findById(id);

    if (!pokemonExists) {
      throw new NotFoundError('Pokémon não encontrado no catálogo.');
    }

    const pokemon = new Pokemon({
      id,
      ...data,
    });

    await this.pokemonRepository.update(pokemon);

    return pokemon;
  }
}
