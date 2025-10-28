import { CommercialName } from '@/types/datacenter';

export type CommercialType = 'ESSENTIALS' | 'PREMIER';

export function getCommercialType(name?: CommercialName): CommercialType {
  if (/^ESSENTIALS(-.*)?$/.test(name)) {
    return 'ESSENTIALS';
  }

  return 'PREMIER';
}
