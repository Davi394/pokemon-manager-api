import { z } from 'zod';

export const searchPokedexQuerySchema = z.object({
  name: z
    .string({
      required_error: 'O parâmetro name é obrigatório',
      invalid_type_error: 'O parâmetro name deve ser um texto',
    })
    .trim()
    .toLowerCase()
    .min(1, 'O parâmetro name não pode ser vazio')
    .regex(
      /^[a-z0-9-]+$/,
      'O nome deve conter apenas letras sem acento, números e hífen',
    ),
});

export type SearchPokedexQuery = z.infer<typeof searchPokedexQuerySchema>;
