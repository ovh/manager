import { Badge, Radio, RadioControl, RadioLabel } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Flag } from '../flag/Flag';
import { TCountryIsoCode } from '../flag/country-iso-code';
import { TDeploymentMode } from '@/types/instance/common.type';
import { PciCard } from '@/components/pciCard/PciCard.component';
import Localization from './Localization.component';
import { DeploymentModeBadge } from '../deploymentModeBadge/DeploymentModeBadge.component';

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

const disabledClassname =
  'bg-[--ods-color-neutral-500] !text-[--ods-color-element-text-selected]';

export const LocalizationCard = ({
  city,
  datacenterDetails,
  macroRegion,
  countryCode,
  deploymentMode,
  disabled,
  selected,
  onSelect,
}: TLocalizationCardProps) => {
  const { t } = useTranslation('creation');
  return (
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
      {disabled ? (
        <div className="flex w-full items-center justify-between">
          <Badge className={disabledClassname} size="sm">
            {t('pci_instance_creation_region_unavailable')}
          </Badge>
          <DeploymentModeBadge
            className={disabledClassname}
            mode={deploymentMode}
          />
        </div>
      ) : (
        <Localization
          name={datacenterDetails}
          deploymentMode={deploymentMode}
        />
      )}
    </PciCard.Header>
  </PciCard>
  );
};
