import express from 'express';
import { setupSwagger } from '@main/config/swagger';
import { pokemonRoutes } from '@infrastructure/http/routes/pokemon.routes';
import { pokedexRoutes } from '@infrastructure/http/routes/pokedex.routes';
import { trainerRoutes } from '@infrastructure/http/routes/trainer.routes';
import { errorHandler } from '@infrastructure/http/middlewares/errorHandler';

const app = express();

app.use(express.json());

// 1. Documentação Swagger
setupSwagger(app);

// 2. Rotas dos módulos (cada arquivo declara o caminho do seu recurso)
app.use('/api/v1', pokemonRoutes);
app.use('/api/v1', pokedexRoutes);
app.use('/api/v1', trainerRoutes);

// 3. Middleware Global de Erros (OBRIGATORIAMENTE NO FINAL)
app.use(errorHandler);

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`🚀 [server]: Servidor rodando em http://localhost:${PORT}`);
  console.log(
    `📖 [docs]: Swagger rodando em http://localhost:${PORT}/api/docs`,
  );
});
