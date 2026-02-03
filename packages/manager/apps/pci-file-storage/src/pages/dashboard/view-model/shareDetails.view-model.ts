import type { TShareDetailsView } from '@/adapters/shares/left/shareDetails.data';
import { mapShareToShareDetailsView } from '@/adapters/shares/left/shareDetails.mapper';
import type { TShare } from '@/domain/entities/share.entity';

export const selectShareDetails = (share: TShare | undefined): TShareDetailsView | undefined =>
  share ? mapShareToShareDetailsView(share) : undefined;
