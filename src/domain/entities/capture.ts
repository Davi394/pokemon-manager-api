import { randomUUID } from 'crypto';

// Regra de negócio: limite de Pokémons no time ativo de um treinador
export const MAX_ACTIVE_TEAM_SIZE = 6;

export interface CaptureStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface CaptureProps {
  id?: string;
  trainerId: string;
  pokedexId: number;
  name: string;
  types: string[];
  sprite: string | null;
  stats: CaptureStats;
  capturedAt?: Date;
}

export class Capture {
  private props: Required<CaptureProps>;

  constructor(props: CaptureProps) {
    this.props = {
      ...props,
      id: props.id ?? randomUUID(),
      capturedAt: props.capturedAt ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }

  get trainerId() {
    return this.props.trainerId;
  }

  get pokedexId() {
    return this.props.pokedexId;
  }

  get name() {
    return this.props.name;
  }

  get types() {
    return this.props.types;
  }

  get sprite() {
    return this.props.sprite;
  }

  get stats() {
    return this.props.stats;
  }

  get capturedAt() {
    return this.props.capturedAt;
  }
}
