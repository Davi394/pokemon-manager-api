import { Router } from 'express';
import { makePokemonController } from '@main/factories/makePokemonController.factory';

const pokemonRoutes = Router();
const pokemonController = makePokemonController();

pokemonRoutes.get('/', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Lista Pokémons do catálogo local'
    #swagger.description = 'Endpoint para listar todos os Pokémons cadastrados em memória, com suporte opcional ao filtro por tipo.'
    #swagger.parameters['type'] = {
      in: 'query',
      required: false,
      type: 'string',
      example: 'Psychic',
      description: 'Tipo do Pokémon usado como filtro opcional.'
    }
    #swagger.responses[200] = {
      description: 'Lista de Pokémons retornada com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { $ref: '#/components/schemas/Pokemon' }
              }
            }
          }
        }
      }
    }
  */
  return pokemonController.list(req, res);
});

pokemonRoutes.post('/', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Cadastra um Pokémon no catálogo local'
    #swagger.description = 'Endpoint para cadastrar manualmente uma espécie de Pokémon no catálogo em memória.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CreatePokemonDto' }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Pokémon criado com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Pokémon criado com sucesso!'
              },
              data: { $ref: '#/components/schemas/Pokemon' }
            }
          }
        }
      }
    }
  */
  return pokemonController.create(req, res);
});

pokemonRoutes.get('/:id', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Busca um Pokémon pelo ID'
    #swagger.description = 'Endpoint para buscar uma espécie de Pokémon do catálogo local a partir do ID informado na URL.'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      example: '150',
      description: 'ID do Pokémon.'
    }
    #swagger.responses[200] = {
      description: 'Pokémon encontrado com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: { $ref: '#/components/schemas/Pokemon' }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.getById(req, res);
});

pokemonRoutes.put('/:id', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Atualiza um Pokémon pelo ID'
    #swagger.description = 'Endpoint para atualizar completamente os dados de um Pokémon existente no catálogo local.'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      example: '150',
      description: 'ID do Pokémon.'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CreatePokemonDto' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Pokémon atualizado com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Pokémon atualizado com sucesso!'
              },
              data: { $ref: '#/components/schemas/Pokemon' }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.update(req, res);
});

pokemonRoutes.delete('/:id', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Remove um Pokémon pelo ID'
    #swagger.description = 'Endpoint para remover uma espécie de Pokémon do catálogo local em memória.'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      example: '150',
      description: 'ID do Pokémon.'
    }
    #swagger.responses[204] = {
      description: 'Pokémon removido com sucesso.'
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.delete(req, res);
});

export { pokemonRoutes };
