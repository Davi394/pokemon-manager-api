import { z } from 'zod';

export const createTrainerBodySchema = z.object({
  name: z
    .string({
      required_error: 'O nome é obrigatório',
      invalid_type_error: 'O nome deve ser um texto',
    })
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z
    .string({
      required_error: 'O e-mail é obrigatório',
      invalid_type_error: 'O e-mail deve ser um texto',
    })
    .trim()
    .toLowerCase()
    .email('Formato de e-mail inválido'),
  city: z
    .string({
      required_error: 'A cidade é obrigatória',
      invalid_type_error: 'A cidade deve ser um texto',
    })
    .trim()
    .min(2, 'A cidade deve ter no mínimo 2 caracteres'),
});

export const trainerIdParamsSchema = z.object({
  trainerId: z.string().uuid('O ID do treinador deve ser um UUID válido'),
});

export const capturePokemonBodySchema = z.object({
  pokemonName: z
    .string({
      required_error: 'O nome do Pokémon é obrigatório',
      invalid_type_error: 'O nome do Pokémon deve ser um texto',
    })
    .trim()
    .toLowerCase()
    .min(1, 'O nome do Pokémon não pode ser vazio')
    .regex(
      /^[a-z0-9-]+$/,
      'O nome deve conter apenas letras sem acento, números e hífen',
    ),
});

export type CreateTrainerBody = z.infer<typeof createTrainerBodySchema>;
export type TrainerIdParams = z.infer<typeof trainerIdParamsSchema>;
export type CapturePokemonBody = z.infer<typeof capturePokemonBodySchema>;
