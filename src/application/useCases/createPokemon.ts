import { Pokemon } from '@domain/entities/pokemon';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';
import { AppError } from '@domain/errors/app.error';

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
      throw new AppError('Pokémon com este ID já está cadastrado.', 400);
    }

    const pokemon = new Pokemon(data);

    await this.pokemonRepository.create(pokemon);

    return pokemon;
  }
}
