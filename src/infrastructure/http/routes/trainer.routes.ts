import { Router } from 'express';
import { makeTrainerController } from '@main/factories/makeTrainerController.factory';
import { validateRequest } from '@infrastructure/http/middlewares/validateRequest';
import { createTrainerBodySchema } from '@infrastructure/http/schemas/trainer.schema';

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

export { trainerRoutes };
