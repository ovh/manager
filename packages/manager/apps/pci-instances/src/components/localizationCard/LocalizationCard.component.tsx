import { Radio, RadioControl, RadioLabel } from '@ovhcloud/ods-react';
import { Flag } from '../flag/Flag';
import { TCountryIsoCode } from '../flag/country-iso-code';
import { TDeploymentMode } from '@/types/instance/common.type';
import { PciCard } from '@/components/pciCard/PciCard.component';
import Localization from './Localization.component';

type TLocalizationCardProps = {
  city: string;
  datacenterDetails: string;
  macroRegion: string;
  countryCode: TCountryIsoCode | null;
  deploymentMode: TDeploymentMode;
  disabled: boolean;
  selected: boolean;
  onSelect: () => void;
};

export const LocalizationCard = ({
  city,
  datacenterDetails,
  macroRegion,
  countryCode,
  deploymentMode,
  disabled,
  selected,
  onSelect,
}: TLocalizationCardProps) => (
  <PciCard
    selectable
    selected={selected}
    compact
    onClick={onSelect}
    disabled={disabled}
  >
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
);
