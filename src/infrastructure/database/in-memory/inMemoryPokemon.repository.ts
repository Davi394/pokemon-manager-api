import { Pokemon } from '@domain/entities/pokemon';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';

export class InMemoryPokemonRepository implements IPokemonRepository {
  public items: Pokemon[] = [];

  async create(pokemon: Pokemon): Promise<void> {
    this.items.push(pokemon);
  }

  async findAll(): Promise<Pokemon[]> {
    return this.items;
  }

  async findByType(type: string): Promise<Pokemon[]> {
    return this.items.filter((item) => item.type === type);
  }

  async findById(id: string): Promise<Pokemon | null> {
    const pokemon = this.items.find((item) => item.id === id);

    if (!pokemon) return null;

    return pokemon;
  }

  async update(pokemon: Pokemon): Promise<void> {
    const pokemonIndex = this.items.findIndex((item) => item.id === pokemon.id);

    if (pokemonIndex >= 0) {
      this.items[pokemonIndex] = pokemon;
    }
  }

  async delete(id: string): Promise<void> {
    const pokemonIndex = this.items.findIndex((item) => item.id === id);

    if (pokemonIndex >= 0) {
      this.items.splice(pokemonIndex, 1);
    }
  }
}
