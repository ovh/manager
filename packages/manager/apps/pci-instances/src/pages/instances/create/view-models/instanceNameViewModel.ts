import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import { getOvhInstanceName } from '@/domain/services/instance.service';

export const selectOvhInstanceName = (regionalizedFlavorId: string | null) => (
  catalog?: TInstancesCatalog,
) => {
  if (!catalog || !regionalizedFlavorId) return null;

  return getOvhInstanceName(catalog, regionalizedFlavorId);
};
