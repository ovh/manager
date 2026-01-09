import { createInstance } from '@/data/api/instance';
import { TInstancePort } from '@/domain/port/instance/port';

export const instanceAdapter: TInstancePort = {
  createInstance,
};
