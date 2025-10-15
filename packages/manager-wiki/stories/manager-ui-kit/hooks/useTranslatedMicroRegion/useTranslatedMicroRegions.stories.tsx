import React from 'react';
import { useTranslatedMicroRegions } from '@ovh-ux/muk';

const TranslatedMicroRegionsComponent = ({ region }: { region: string }) => {
  const {
    translateMicroRegion,
    translateMacroRegion,
    translateContinentRegion,
  } = useTranslatedMicroRegions();

  return (
    <div className="space-y-4">
      <strong>Region Code:</strong> {region}
      <br />
      <strong>Micro-region:</strong> {translateMicroRegion(region) || 'N/A'}
      <br />
      <strong>Macro-region:</strong> {translateMacroRegion(region) || 'N/A'}
      <br />
      <strong>Continent:</strong> {translateContinentRegion(region) || 'N/A'}
    </div>
  );
};

export default {
  title: 'Manager UI Kit/Hooks/useTranslatedMicroRegions',
  component: TranslatedMicroRegionsComponent,
  argTypes: {
    region: {
      control: 'text',
      description: 'OVHcloud region identifier',
    },
  },
};

export const StandardRegion = {
  args: {
    region: 'GRA-1',
  },
};

export const LocalZone = {
  args: {
    region: 'EU-WEST-LZ-MAD-A',
  },
};

export const SingleSegment = {
  args: {
    region: 'WES1',
  },
};

export const MultiSegment = {
  args: {
    region: 'US-EAST-VA-1',
  },
};

export const UnknownRegion = {
  args: {
    region: 'UNKNOWN-REGION',
  },
};
