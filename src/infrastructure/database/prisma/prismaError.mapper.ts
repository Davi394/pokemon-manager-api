import { Prisma } from '@prisma/client';
import { AppError } from '@domain/errors/app.error';
import { ConflictError } from '@domain/errors/conflict.error';
import { NotFoundError } from '@domain/errors/notFound.error';

export class PrismaErrorMapper {
  static toAppError(error: Prisma.PrismaClientKnownRequestError): AppError {
    switch (error.code) {
      case 'P2002': {
        // Violação de restrição única (@unique), ex.: e-mail já cadastrado
        const target = (error.meta?.target as string[])?.join(', ') || 'campo';
        return new ConflictError(
          `Já existe um registro cadastrado com este ${target}`,
        );
      }
      case 'P2025': {
        // Registro não encontrado para atualização ou exclusão
        return new NotFoundError('Registro não encontrado no banco de dados.');
      }
      case 'P2003': {
        // Violação de chave estrangeira (o recurso associado não existe)
        return new AppError(
          'Relacionamento inválido. O recurso associado não existe',
          400,
        );
      }
      default:
        // Qualquer outro erro conhecido do Prisma não mapeado explicitamente
        return new AppError(
          'Erro ao processar operação no banco de dados',
          500,
        );
    }
  }
}
