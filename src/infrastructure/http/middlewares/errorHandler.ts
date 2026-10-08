import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '@domain/errors/app.error';
import { PrismaErrorMapper } from '@infrastructure/database/prisma/prismaError.mapper';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // 1. Erros conhecidos da aplicação (AppError e filhas: ConflictError, etc.)
  if (error instanceof AppError) {
    const responsePayload: Record<string, unknown> = {
      status: 'error',
      statusCode: error.statusCode,
      message: error.message,
    };

    if (error.details !== undefined && error.details !== null) {
      responsePayload.details = error.details;
    }

    return res.status(error.statusCode).json(responsePayload);
  }

  // Erros de validação do Zod que escaparem do validateRequest
  if (error instanceof ZodError) {
    const issueDetails = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: issueDetails,
    });
  }

  // 2. Erros conhecidos do banco de dados (Prisma), traduzidos pelo mapper
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const appError = PrismaErrorMapper.toAppError(error);

    if (appError.statusCode === 500) {
      console.error('💥 [Prisma Error]:', error);
    }

    return res.status(appError.statusCode).json({
      status: 'error',
      statusCode: appError.statusCode,
      message: appError.message,
    });
  }

  // 3. Log interno para erros não mapeados (bugs de runtime)
  console.error('💥 [Uncaught Exception]:', error);

  // 4. Resposta genérica para o cliente (sem expor detalhes internos)
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Erro interno no servidor.',
  });
}
