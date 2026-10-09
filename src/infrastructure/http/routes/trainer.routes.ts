import { Router } from 'express';
import { makeTrainerController } from '@main/factories/makeTrainerController.factory';
import { validateRequest } from '@infrastructure/http/middlewares/validateRequest';
import {
  capturePokemonBodySchema,
  createTrainerBodySchema,
  trainerIdParamsSchema,
} from '@infrastructure/http/schemas/trainer.schema';

const trainerRoutes = Router();
const trainerController = makeTrainerController();

trainerRoutes.post(
  '/trainers',
  validateRequest({ body: createTrainerBodySchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Cadastra um novo treinador'
      #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'city'],
              properties: {
                name: { type: 'string', example: 'Ash Ketchum' },
                email: { type: 'string', example: 'ash@pallet.com' },
                city: { type: 'string', example: 'Pallet' }
              }
            }
          }
        }
      }
      #swagger.responses[201] = { description: 'Treinador cadastrado com sucesso.' }
      #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
      #swagger.responses[409] = { description: 'E-mail já cadastrado.' }
    */
    return trainerController.create(req, res);
  },
);

trainerRoutes.post(
  '/trainers/:trainerId/captures',
  validateRequest({
    params: trainerIdParamsSchema,
    body: capturePokemonBodySchema,
  }),
  (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Captura um Pokémon para o time do treinador'
      #swagger.description = 'Busca o Pokémon na PokéAPI (imagem, atributos base e tipos) e salva a captura. Limite: 6 Pokémons no time ativo.'
      #swagger.parameters['trainerId'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: 'ID (UUID) do treinador.'
      }
      #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['pokemonName'],
              properties: {
                pokemonName: { type: 'string', example: 'pikachu' }
              }
            }
          }
        }
      }
      #swagger.responses[201] = { description: 'Pokémon capturado com sucesso.' }
      #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
      #swagger.responses[404] = { description: 'Treinador ou Pokémon não encontrado.' }
      #swagger.responses[409] = { description: 'Time já possui 6 Pokémons.' }
      #swagger.responses[502] = { description: 'PokéAPI indisponível.' }
    */
    return trainerController.capture(req, res);
  },
);

trainerRoutes.get(
  '/trainers/:trainerId/team',
  validateRequest({ params: trainerIdParamsSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Lista o time atual do treinador'
      #swagger.parameters['trainerId'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: 'ID (UUID) do treinador.'
      }
      #swagger.responses[200] = { description: 'Time do treinador (até 6 Pokémons).' }
      #swagger.responses[400] = { description: 'ID do treinador inválido.' }
      #swagger.responses[404] = { description: 'Treinador não encontrado.' }
    */
    return trainerController.team(req, res);
  },
);

export { trainerRoutes };
