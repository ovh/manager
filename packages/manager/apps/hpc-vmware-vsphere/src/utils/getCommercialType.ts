import { CommercialName } from '@/types/datacenter';

export type CommercialType = 'ESSENTIALS' | 'PREMIER' | 'UNKNOWN';

export function getCommercialType(name?: CommercialName): CommercialType {
  if (/^ESSENTIALS(-.*)?$/.test(name)) {
    return 'ESSENTIALS';
  }
  if (/^PREMIER(-.*)?$/.test(name)) {
    return 'PREMIER';
  }

  return 'UNKNOWN';
}
