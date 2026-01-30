import { TShareListRow } from '@/adapters/shares/left/shareList.data';
import { mapShareToShareListRow } from '@/adapters/shares/left/shareList.mapper';
import { TShare } from '@/domain/entities/share.entity';

export const selectSharesForList = (data: TShare[] | undefined): TShareListRow[] =>
  (data ?? []).map(mapShareToShareListRow);

export const selectHasShares = (data?: TShare[]): boolean => (data ?? []).length > 0;
