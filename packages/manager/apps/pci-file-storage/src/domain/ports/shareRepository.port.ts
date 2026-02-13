import { TShareToCreate } from '@/domain/entities/share.entity';

export type ShareRepository = {
  createShare: (params: { projectId: string; shareToCreate: TShareToCreate }) => Promise<void>;
};
