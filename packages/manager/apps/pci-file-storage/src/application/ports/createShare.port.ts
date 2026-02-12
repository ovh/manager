import { CreateShare } from '@/domain/entities/share.entity';

export type CreateSharePort = {
  createShare: (params: { projectId: string; createShare: CreateShare }) => Promise<void>;
};
