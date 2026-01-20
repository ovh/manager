import { Radio, RadioControl, RadioLabel } from '@ovhcloud/ods-react';

import { PciCard } from '@/components/pciCard/PciCard.component';
import { TCountryCode } from '@/domain/entities/regions';

import { Flag } from './Flag.component';
import { Location } from './Location.component';

type TRegionCardProps = {
  city: string;
  datacenterDetails: string;
  regionId: string;
  countryCode: TCountryCode | null;
  disabled: boolean;
  labels?: Array<string>;
  onSelect: () => void;
};

export const RegionCard = ({
  city,
  datacenterDetails,
  regionId,
  countryCode,
  disabled,
  labels,
  onSelect,
}: TRegionCardProps) => (
  <PciCard selectable compact onClick={onSelect} disabled={disabled}>
    <PciCard.Header>
      <Radio value={regionId} disabled={disabled}>
        <RadioControl />
        <RadioLabel className="flex items-center gap-x-4 text-lg font-bold text-[--ods-color-heading]">
          {countryCode && <Flag isoCode={countryCode} />}
          {city}
        </RadioLabel>
      </Radio>
      <Location name={datacenterDetails} labels={labels} />
    </PciCard.Header>
  </PciCard>
);
