import React from 'react';

import { Radio, RadioControl, RadioLabel } from '@ovhcloud/ods-react';

import { PciCard } from '@/components/new-lib/pciCard/PciCard.component';
import { TDeploymentMode } from '@/domain/entities/catalog.entity';

import { Flag } from '../flag/Flag';
import { TCountryIsoCode } from '../flag/country-iso-code';
import Localization from './Localization.component';

type TLocalizationCardProps = {
  city: string;
  datacenterDetails: string;
  macroRegion: string;
  countryCode: TCountryIsoCode | null;
  deploymentMode: TDeploymentMode;
  disabled: boolean;
  onSelect: () => void;
};

export const LocalizationCard = React.memo(
  ({
    city,
    datacenterDetails,
    macroRegion,
    countryCode,
    deploymentMode,
    disabled,
    onSelect,
  }: TLocalizationCardProps) => (
    <PciCard selectable compact onClick={onSelect} disabled={disabled}>
      <PciCard.Header>
        <Radio value={macroRegion} disabled={disabled}>
          <RadioControl />
          <RadioLabel className="flex items-center gap-x-4 text-lg font-bold text-[--ods-color-heading]">
            {countryCode && <Flag isoCode={countryCode} />}
            {city}
          </RadioLabel>
        </Radio>
        <Localization name={datacenterDetails} deploymentMode={deploymentMode} />
      </PciCard.Header>
    </PciCard>
  ),
);
