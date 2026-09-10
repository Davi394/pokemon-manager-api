import { Request, Response } from 'express';
import { CreatePokemonUseCase } from '@application/useCases/createPokemon';
import { ListPokemonsUseCase } from '@application/useCases/listPokemons';
import { GetPokemonByIdUseCase } from '@application/useCases/getPokemonById';
import { ResourceNotFoundError } from '@domain/errors/resource-not-found.error';
import { UpdatePokemonUseCase } from '@application/useCases/updatePokemon';
import { DeletePokemonUseCase } from '@application/useCases/deletePokemon';

export class PokemonController {
  constructor(
    private listPokemonsUseCase: ListPokemonsUseCase,
    private createPokemonUseCase: CreatePokemonUseCase,
    private getPokemonByIdUseCase: GetPokemonByIdUseCase,
    private updatePokemonUseCase: UpdatePokemonUseCase,
    private deletePokemonUseCase: DeletePokemonUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    const { id, name, type, hp, attack, defense } = req.body;

    const pokemon = await this.createPokemonUseCase.execute({
      id,
      name,
      type,
      hp,
      attack,
      defense,
    });

    return res.status(201).json({
      message: 'PokÃ©mon criado com sucesso!',
      data: {
        id: pokemon.id,
        name: pokemon.name,
        type: pokemon.type,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
      },
    });
  }

  async list(req: Request, res: Response): Promise<Response> {
    const type = req.query.type as string | undefined;

    const pokemons = await this.listPokemonsUseCase.execute({ type });

    const formattedPokemons = pokemons.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
    }));

    return res.status(200).json({ data: formattedPokemons });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    try {
      const pokemon = await this.getPokemonByIdUseCase.execute(id);

      return res.status(200).json({
        data: {
          id: pokemon.id,
          name: pokemon.name,
          type: pokemon.type,
          hp: pokemon.hp,
          attack: pokemon.attack,
          defense: pokemon.defense,
        },
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).json({
          message: error.message,
        });
      }

      throw error;
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;
    const { name, type, hp, attack, defense } = req.body;

    try {
      const pokemon = await this.updatePokemonUseCase.execute(id, {
        name,
        type,
        hp,
        attack,
        defense,
      });

      return res.status(200).json({
        message: 'PokÃ©mon atualizado com sucesso!',
        data: {
          id: pokemon.id,
          name: pokemon.name,
          type: pokemon.type,
          hp: pokemon.hp,
          attack: pokemon.attack,
          defense: pokemon.defense,
        },
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).json({
          message: error.message,
        });
      }

      throw error;
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    try {
      await this.deletePokemonUseCase.execute(id);

      return res.status(204).send();
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).json({
          message: error.message,
        });
      }

      throw error;
    }
  }
}
