import { Capture } from '@domain/entities/capture';

export interface ICaptureRepository {
  create(capture: Capture): Promise<void>;
  countByTrainerId(trainerId: string): Promise<number>;
  findByTrainerId(trainerId: string): Promise<Capture[]>;
}
