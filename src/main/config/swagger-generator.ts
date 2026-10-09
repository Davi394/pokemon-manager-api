import path from 'path';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '2.0.0',
    title: 'PokéManager API',
    description:
      'API para gerenciamento de Pokémons desenvolvida na disciplina Tópicos Especiais em Engenharia de Software (UFF)',
  },
  host: 'localhost:3333',
  basePath: '/api/v1',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Pokemons',
      description: 'Catálogo local de Pokémons',
    },
    {
      name: 'Pokedex',
      description: 'Consulta à PokéAPI oficial',
    },
    {
      name: 'Trainers',
      description: 'Treinadores, capturas e times',
    },
  ],
  definitions: {
    Pokemon: {
      id: '25',
      name: 'Pikachu',
      type: 'Electric',
      hp: 35,
      attack: 55,
      defense: 40,
    },
    CreatePokemonDto: {
      $id: '25',
      $name: 'Pikachu',
      $type: 'Electric',
      $hp: 35,
      $attack: 55,
      $defense: 40,
    },
    ErrorResponse: {
      status: 'error',
      statusCode: 404,
      message: 'Pokémon não encontrado no catálogo.',
    },
  },
};

const outputFile = path.resolve(__dirname, 'swagger-output.json');

// Lemos os arquivos de rotas diretamente (o prefixo /api/v1 vem do basePath)
const endpointsFiles = [
  path.resolve(__dirname, '../../infrastructure/http/routes/pokemon.routes.ts'),
  path.resolve(__dirname, '../../infrastructure/http/routes/pokedex.routes.ts'),
  path.resolve(__dirname, '../../infrastructure/http/routes/trainer.routes.ts'),
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
