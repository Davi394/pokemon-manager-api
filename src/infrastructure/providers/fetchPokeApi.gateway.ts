import { AppError } from '@domain/errors/app.error';
import {
  IPokeApiGateway,
  PokedexEntryDTO,
} from '@domain/gateways/pokeApi.gateway';

// Formato (parcial) da resposta da PokéAPI: só os campos que usamos
interface PokeApiPokemonResponse {
  id: number;
  name: string;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: { front_default: string | null };
}

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const REQUEST_TIMEOUT_MS = 5000;

export class FetchPokeApiGateway implements IPokeApiGateway {
  async findByName(name: string): Promise<PokedexEntryDTO | null> {
    let response: Response;

    try {
      response = await fetch(
        `${POKEAPI_BASE_URL}/pokemon/${encodeURIComponent(name)}`,
        { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
      );
    } catch {
      // Timeout, sem internet ou falha de DNS
      throw new AppError(
        'Não foi possível conectar à PokéAPI. Tente novamente mais tarde.',
        502,
      );
    }

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new AppError(
        'A PokéAPI retornou um erro inesperado. Tente novamente mais tarde.',
        502,
      );
    }

    const data = (await response.json()) as PokeApiPokemonResponse;

    return this.toDTO(data);
  }

  // Traduz o JSON da PokéAPI para o DTO da nossa aplicação
  private toDTO(data: PokeApiPokemonResponse): PokedexEntryDTO {
    const getStat = (statName: string): number =>
      data.stats.find((item) => item.stat.name === statName)?.base_stat ?? 0;

    return {
      pokedexId: data.id,
      name: data.name,
      types: [...data.types]
        .sort((a, b) => a.slot - b.slot)
        .map((item) => item.type.name),
      sprite: data.sprites.front_default,
      stats: {
        hp: getStat('hp'),
        attack: getStat('attack'),
        defense: getStat('defense'),
        specialAttack: getStat('special-attack'),
        specialDefense: getStat('special-defense'),
        speed: getStat('speed'),
      },
    };
  }
}
