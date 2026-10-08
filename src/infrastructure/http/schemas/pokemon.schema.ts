import { z } from 'zod';

// Regra comum aos atributos de batalha: número inteiro maior que zero
const statSchema = (field: string) =>
  z
    .number({
      required_error: `O campo ${field} é obrigatório`,
      invalid_type_error: `O campo ${field} deve ser um número`,
    })
    .int(`O campo ${field} deve ser um número inteiro`)
    .positive(`O campo ${field} deve ser maior que zero`);

export const listPokemonsQuerySchema = z.object({
  type: z.string().trim().min(1, 'O tipo não pode ser vazio').optional(),
});

export const pokemonIdParamsSchema = z.object({
  id: z.string().trim().min(1, 'O ID do Pokémon é obrigatório'),
});

export const createPokemonBodySchema = z.object({
  id: z
    .string({
      required_error: 'O ID é obrigatório',
      invalid_type_error: 'O ID deve ser um texto',
    })
    .trim()
    .min(1, 'O ID é obrigatório'),
  name: z
    .string({
      required_error: 'O nome é obrigatório',
      invalid_type_error: 'O nome deve ser um texto',
    })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres'),
  type: z
    .string({
      required_error: 'O tipo é obrigatório',
      invalid_type_error: 'O tipo deve ser um texto',
    })
    .trim()
    .min(1, 'O tipo não pode ser vazio'),
  hp: statSchema('hp'),
  attack: statSchema('attack'),
  defense: statSchema('defense'),
});

// O PUT recebe os mesmos campos do POST, exceto o id (que vem na URL)
export const updatePokemonBodySchema = createPokemonBodySchema.omit({
  id: true,
});

export type ListPokemonsQuery = z.infer<typeof listPokemonsQuerySchema>;
export type PokemonIdParams = z.infer<typeof pokemonIdParamsSchema>;
export type CreatePokemonBody = z.infer<typeof createPokemonBodySchema>;
export type UpdatePokemonBody = z.infer<typeof updatePokemonBodySchema>;
