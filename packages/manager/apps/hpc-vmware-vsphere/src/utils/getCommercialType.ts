import { CommercialName } from '@/types/datacenter';

export type CommercialType = 'ESSENTIAL' | 'PREMIER' | 'UNKNOWN';

export function getCommercialType(name?: CommercialName): CommercialType {
  if (name === 'ESSENTIALS' || name?.startsWith('ESSENTIALS-')) {
    return 'ESSENTIAL';
  }

  if (name === 'PREMIER' || name?.startsWith('PREMIER-')) {
    return 'PREMIER';
  }

  return 'UNKNOWN';
}
