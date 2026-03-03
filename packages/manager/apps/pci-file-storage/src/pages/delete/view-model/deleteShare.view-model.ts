import type { TShare } from '@/domain/entities/share.entity';
import { canShareBeDeleted } from '@/domain/services/share.service';

export type TShareDeletionView = {
  shareName?: string;
  canBeDeleted: boolean;
};

export const selectShareDeletionView = (share: TShare | undefined): TShareDeletionView => ({
  shareName: share?.name,
  canBeDeleted: canShareBeDeleted(share),
});
