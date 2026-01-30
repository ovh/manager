import { RegionType } from '@/types/infrastructures.type';

export const LABELS = {
  TENANT: 'Tenant',
  TENANTS: 'Tenants',
  ID: 'ID',
  URN: 'URN',
} as const;

export const REGION_BADGE_LABELS: Record<RegionType, string> = {
  'LOCAL-ZONE': 'Local Zone',
  'REGION-1-AZ': '1-AZ',
  'REGION-3-AZ': '3-AZ',
};
