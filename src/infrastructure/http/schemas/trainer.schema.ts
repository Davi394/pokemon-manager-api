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

export type CreateTrainerBody = z.infer<typeof createTrainerBodySchema>;
