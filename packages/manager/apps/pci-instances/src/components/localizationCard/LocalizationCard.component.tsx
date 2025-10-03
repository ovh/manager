import { Radio, RadioControl, RadioLabel, Text } from '@ovhcloud/ods-react';
import { Flag } from '../flag/Flag';
import { TCountryIsoCode } from '../flag/country-iso-code';
import { DeploymentModeBadge } from '../deploymentModeBadge/DeploymentModeBadge.component';
import { TDeploymentMode } from '@/types/instance/common.type';
import { PciCard } from '@/components/pciCard/PciCard.component';

type TLocalizationCardProps = {
  title: string;
  region: string;
  countryCode: TCountryIsoCode;
  deploymentMode: TDeploymentMode;
  isSelected: boolean;
  onSelect: (region: string) => void;
};

export const LocalizationCard = ({
  title,
  region,
  countryCode,
  deploymentMode,
  isSelected,
  onSelect,
}: TLocalizationCardProps) => (
  <PciCard
    selectable
    compact
    selected={isSelected}
    onClick={() => onSelect(region)}
  >
    <PciCard.Header>
      <Radio value={region}>
        <RadioControl />
        <RadioLabel className="font-bold text-lg text-[--ods-color-heading] gap-x-4 flex items-center">
          <Flag isoCode={countryCode} /> {title}
        </RadioLabel>
      </Radio>
      <div className="flex items-center justify-between gap-4 w-full">
        <Text>{region}</Text>
        <DeploymentModeBadge mode={deploymentMode} />
      </div>
    </PciCard.Header>
  </PciCard>
);
