import express from 'express';
import { pokemonRoutes } from '@infrastructure/http/routes/pokemon.routes';

const app = express();

app.use(express.json());

app.use('/api/v1/pokemons', pokemonRoutes);

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`🚀 [server]: Servidor rodando em http://localhost:${PORT}`);
});
