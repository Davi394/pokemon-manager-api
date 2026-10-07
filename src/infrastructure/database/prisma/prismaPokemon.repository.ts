import { Pokemon } from '@domain/entities/pokemon';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';
import { Pokemon as PrismaPokemon } from '@prisma/client';
import { prisma } from './client';

export class PrismaPokemonRepository implements IPokemonRepository {
  async create(pokemon: Pokemon): Promise<void> {
    await prisma.pokemon.create({
      data: {
        id: pokemon.id,
        name: pokemon.name,
        type: pokemon.type,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
      },
    });
  }

  async findAll(): Promise<Pokemon[]> {
    const pokemonsRaw = await prisma.pokemon.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return pokemonsRaw.map((pokemonRaw) => this.toDomain(pokemonRaw));
  }

  async findByType(type: string): Promise<Pokemon[]> {
    const pokemonsRaw = await prisma.pokemon.findMany({
      where: { type },
      orderBy: { createdAt: 'asc' },
    });

    return pokemonsRaw.map((pokemonRaw) => this.toDomain(pokemonRaw));
  }

  async findById(id: string): Promise<Pokemon | null> {
    const pokemonRaw = await prisma.pokemon.findUnique({ where: { id } });

    if (!pokemonRaw) return null;

    return this.toDomain(pokemonRaw);
  }

  async update(pokemon: Pokemon): Promise<void> {
    await prisma.pokemon.update({
      where: { id: pokemon.id },
      data: {
        name: pokemon.name,
        type: pokemon.type,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.pokemon.delete({ where: { id } });
  }

  // Converte a linha do banco (tipo do Prisma) na entidade do Domínio
  private toDomain(pokemonRaw: PrismaPokemon): Pokemon {
    return new Pokemon({
      id: pokemonRaw.id,
      name: pokemonRaw.name,
      type: pokemonRaw.type,
      hp: pokemonRaw.hp,
      attack: pokemonRaw.attack,
      defense: pokemonRaw.defense,
    });
  }
}
