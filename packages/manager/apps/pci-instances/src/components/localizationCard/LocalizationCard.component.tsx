import { Radio, RadioControl, RadioLabel, Text } from '@ovhcloud/ods-react';
import { Flag } from '../flag/Flag';
import { TCountryIsoCode } from '../flag/country-iso-code';
import { DeploymentModeBadge } from '../deploymentModeBadge/DeploymentModeBadge.component';
import { TDeploymentMode } from '@/types/instance/common.type';
import { PciCard } from '@/components/pciCard/PciCard.component';

type TLocalizationCardProps = {
  city: string;
  datacenterDetails: string;
  macroRegion: string;
  countryCode: TCountryIsoCode | null;
  deploymentMode: TDeploymentMode;
  isSelected: boolean;
  disabled: boolean;
  onSelect: () => void;
};

export const LocalizationCard = ({
  city,
  datacenterDetails,
  macroRegion,
  countryCode,
  deploymentMode,
  isSelected,
  disabled,
  onSelect,
}: TLocalizationCardProps) => (
  <PciCard
    selectable
    compact
    selected={isSelected}
    onClick={onSelect}
    disabled={disabled}
  >
    <PciCard.Header>
      <Radio value={macroRegion} disabled={disabled}>
        <RadioControl />
        <RadioLabel className="font-bold text-lg text-[--ods-color-heading] gap-x-4 flex items-center">
          {countryCode && <Flag isoCode={countryCode} />}
          {city}
        </RadioLabel>
      </Radio>
      <div className="flex items-center justify-between gap-4 w-full">
        <Text>{datacenterDetails}</Text>
        <DeploymentModeBadge mode={deploymentMode} />
      </div>
    </PciCard.Header>
  </PciCard>
);
