import { DeepReadonly } from '../utils.type';

export type TImageType = 'custom' | 'official' | 'rescue' | 'snapshot';
export type TImageVisibility = 'community' | 'private' | 'public' | 'shared';
export type TImageStatus = 'active' | 'deleted' | 'error' | 'queued' | 'saving';

export type TImageDto = DeepReadonly<{
  baseImageRef: string;
  createdAt: string;
  id: string;
  name: string;
  osType: string;
  region: string;
  size: number;
  status: TImageStatus;
  type: TImageType;
  visibility: TImageVisibility;
}>;
