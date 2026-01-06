import {
  REGION_EU_WEST_GRA,
  REGION_EU_WEST_RBX,
  REGION_EU_WEST_SBG,
} from '@/common/mocks/catalog/catalog.mock';
import { ReferenceRegion } from '@/common/types/referenceRegions.type';

export const REFERENCE_REGION_EU_WEST_RBX: ReferenceRegion = {
  id: REGION_EU_WEST_RBX,
  certifications: ['PCI_DSS'],
  kmipEndpoint: 'example.org:5697',
  restEndpoint: 'https://example.org',
  type: 'REGION-1-AZ',
};

export const REFERENCE_REGION_EU_WEST_SBG: ReferenceRegion = {
  id: REGION_EU_WEST_SBG,
  certifications: ['PCI_DSS', 'ISO_666'],
  kmipEndpoint: 'example.org:5697',
  restEndpoint: 'https://example.org',
  type: 'REGION-1-AZ',
};

export const REFERENCE_REGION_EU_WEST_GRA: ReferenceRegion = {
  id: REGION_EU_WEST_GRA,
  certifications: [],
  kmipEndpoint: 'example.org:5697',
  restEndpoint: 'https://example.org',
  type: 'REGION-1-AZ',
};

export const referenceRegionsMock: ReferenceRegion[] = [
  REFERENCE_REGION_EU_WEST_RBX,
  REFERENCE_REGION_EU_WEST_SBG,
  REFERENCE_REGION_EU_WEST_GRA,
];
