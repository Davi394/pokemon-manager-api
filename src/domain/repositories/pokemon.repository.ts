import { Pokemon } from '@domain/entities/pokemon';

export interface IPokemonRepository {
  create(pokemon: Pokemon): Promise<void>;
  findAll(): Promise<Pokemon[]>;
  findByType(type: string): Promise<Pokemon[]>;
  findById(id: string): Promise<Pokemon | null>;
  update(pokemon: Pokemon): Promise<void>;
  delete(id: string): Promise<void>;
}
