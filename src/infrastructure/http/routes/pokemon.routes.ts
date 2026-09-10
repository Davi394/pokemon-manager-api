import { Router } from 'express';
import { makePokemonController } from '@main/factories/makePokemonController.factory';

const pokemonRoutes = Router();
const pokemonController = makePokemonController();

pokemonRoutes.get('/', (req, res) => {
  return pokemonController.list(req, res);
});

pokemonRoutes.get('/:id', (req, res) => {
  return pokemonController.getById(req, res);
});

pokemonRoutes.post('/', (req, res) => {
  return pokemonController.create(req, res);
});

pokemonRoutes.put('/:id', (req, res) => {
  return pokemonController.update(req, res);
});

pokemonRoutes.delete('/:id', (req, res) => {
  return pokemonController.delete(req, res);
});

export { pokemonRoutes };
