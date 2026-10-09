import { Request, Response } from 'express';
import { SearchPokedexUseCase } from '@application/useCases/searchPokedex';

export class PokedexController {
  constructor(private searchPokedexUseCase: SearchPokedexUseCase) {}

  async search(req: Request, res: Response): Promise<Response> {
    const name = req.query.name as string;

    const entry = await this.searchPokedexUseCase.execute(name);

    return res.status(200).json({ data: entry });
  }
}
