import { randomUUID } from 'crypto';

export interface TrainerProps {
  id?: string;
  name: string;
  email: string;
  city: string;
}

export class Trainer {
  private props: Required<TrainerProps>;

  constructor(props: TrainerProps) {
    this.props = {
      ...props,
      id: props.id ?? randomUUID(),
    };
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get city() {
    return this.props.city;
  }
}
