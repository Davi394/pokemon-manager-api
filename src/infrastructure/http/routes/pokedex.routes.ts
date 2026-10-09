import { Router } from 'express';
import { makePokedexController } from '@main/factories/makePokedexController.factory';
import { validateRequest } from '@infrastructure/http/middlewares/validateRequest';
import { searchPokedexQuerySchema } from '@infrastructure/http/schemas/pokedex.schema';

const pokedexRoutes = Router();
const pokedexController = makePokedexController();

pokedexRoutes.get(
  '/search',
  validateRequest({ query: searchPokedexQuerySchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Pokedex']
      #swagger.summary = 'Busca um Pokémon na PokéAPI oficial'
      #swagger.description = 'Consulta a PokéAPI pelo nome e retorna os dados formatados (tipos, imagem e atributos base).'
      #swagger.parameters['name'] = {
        in: 'query',
        required: true,
        type: 'string',
        example: 'pikachu',
        description: 'Nome do Pokémon (maiúsculas são aceitas).'
      }
      #swagger.responses[200] = { description: 'Pokémon encontrado na PokéAPI.' }
      #swagger.responses[400] = { description: 'Parâmetro name ausente ou inválido.' }
      #swagger.responses[404] = { description: 'Pokémon não encontrado na PokéAPI.' }
      #swagger.responses[502] = { description: 'PokéAPI indisponível ou fora do tempo limite.' }
    */
    return pokedexController.search(req, res);
  },
);

export { pokedexRoutes };
