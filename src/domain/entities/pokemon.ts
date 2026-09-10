export interface PokemonProps {
  id: string;
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
}

export class Pokemon {
  private props: PokemonProps;

  constructor(props: PokemonProps) {
    if (props.hp <= 0) {
      throw new Error('HP deve ser maior que zero.');
    }

    if (props.attack <= 0) {
      throw new Error('Ataque deve ser maior que zero.');
    }

    if (props.defense <= 0) {
      throw new Error('Defesa deve ser maior que zero.');
    }

    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get type() {
    return this.props.type;
  }

  get hp() {
    return this.props.hp;
  }

  get attack() {
    return this.props.attack;
  }

  get defense() {
    return this.props.defense;
  }
}
