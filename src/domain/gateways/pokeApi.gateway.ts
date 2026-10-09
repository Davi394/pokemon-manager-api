export interface PokemonStatsDTO {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokedexEntryDTO {
  pokedexId: number;
  name: string;
  types: string[];
  sprite: string | null;
  stats: PokemonStatsDTO;
}

export interface IPokeApiGateway {
  findByName(name: string): Promise<PokedexEntryDTO | null>;
}
