import type { CreateShare, TShare } from '@/domain/entities/share.entity';

const DELETE_ACTION = 'delete' as const;

export const canShareBeDeleted = (share: TShare | undefined): boolean =>
  !!share && (share.enabledActions ?? []).includes(DELETE_ACTION);

export const isSizeValid = (size: number): boolean => !isNaN(size) && size > 0;

export const isCreateShareValid = ({ name, network, region, size, type }: CreateShare): boolean =>
  !!name.trim() && !!network.id.trim() && !!region.trim() && isSizeValid(size) && !!type.trim();
