import { Pokemon } from '@domain/entities/pokemon';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';

interface CreatePokemonDTO {
  id: string;
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
}

export class CreatePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const pokemonAlreadyExists = await this.pokemonRepository.findById(data.id);

    if (pokemonAlreadyExists) {
      throw new Error('Pokémon com este ID já está cadastrado.');
    }

    const pokemon = new Pokemon(data);

    await this.pokemonRepository.create(pokemon);

    return pokemon;
  }
}
