import type { TShare } from '@/domain/entities/share.entity';

const DELETE_ACTION = 'delete' as const;

export const canShareBeDeleted = (share: TShare | undefined): boolean =>
  !!share && (share.enabledActions ?? []).includes(DELETE_ACTION);
