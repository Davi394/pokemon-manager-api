import { NotFoundError } from '@domain/errors/notFound.error';
import {
  IPokeApiGateway,
  PokedexEntryDTO,
} from '@domain/gateways/pokeApi.gateway';

export class SearchPokedexUseCase {
  constructor(private pokeApiGateway: IPokeApiGateway) {}

  async execute(name: string): Promise<PokedexEntryDTO> {
    const entry = await this.pokeApiGateway.findByName(name);

    if (!entry) {
      throw new NotFoundError(`Pokémon "${name}" não encontrado na PokéAPI.`);
    }

    return entry;
  }
}
