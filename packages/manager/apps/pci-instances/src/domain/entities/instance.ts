import { TOperationStatus } from './operations';

export type TInstanceCreationData = {
  operationId: string | null;
  status: TOperationStatus;
};
