import { TCreateInstanceDTO } from '@/adapters/tanstack/instances/right/dto.type';
import { TInstanceCreationData } from '@/domain/entities/instance';

export type TCreateInstanceArgs = {
  projectId: string;
  regionName: string;
  payload: TCreateInstanceDTO;
};

export type TInstancePort = {
  createInstance: ({
    projectId,
    regionName,
    payload,
  }: TCreateInstanceArgs) => Promise<TInstanceCreationData>;
};
