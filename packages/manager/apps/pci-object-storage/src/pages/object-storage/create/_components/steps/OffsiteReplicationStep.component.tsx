import {
  Badge,
  RadioGroup,
  RadioGroupItem,
  Label,
  Alert,
  AlertDescription,
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
} from '@datatr-ux/uxlib';
import React from 'react';
import { Region } from '@datatr-ux/ovhcloud-types/cloud';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { MappedRegions } from './RegionStep.component';
import { useTranslatedMicroRegions } from '@/hooks/useTranslatedMicroRegions';
import RegionWithFlag from '@/components/region-with-flag/RegionWithFlag.component';

enum ReplicationMode {
  Disabled = 'disabled',
  Enabled = 'enabled',
}

type OffsiteReplicationValue = {
  enabled?: boolean;
  region?: string;
};
interface OffsiteReplicationStepProps {
  regions: Region[];
  value?: OffsiteReplicationValue;
  onChange?: (newValue: OffsiteReplicationValue) => void;
}
const OffsiteReplicationStep = React.forwardRef<
  HTMLInputElement,
  OffsiteReplicationStepProps
>(({ value, onChange, regions }, ref) => {
  const { t } = useTranslation('pci-object-storage/order-funnel');
  const {
    translateContinentRegion,
    translateMicroRegion,
  } = useTranslatedMicroRegions();
  const mappedRegions: MappedRegions[] = regions.map((r) => ({
    label: translateMicroRegion(r.name),
    continent: translateContinentRegion(r.name),
    ...r,
  }));
  const continents = [
    ...new Set([...mappedRegions.map((mr) => mr.continent).toSorted()]),
  ];
  const selectedRegion = mappedRegions.find((r) => r.name === value.region);

  const REPLICATION_MODES_OPTIONS: ReplicationMode[] = [
    ReplicationMode.Disabled,
    ReplicationMode.Enabled,
  ];
  const RECOMMENEDED_REPLICATION_MODE = ReplicationMode.Enabled;

  const onSelectRegion = (newValue: string) => {
    if (newValue !== value.region) {
      onChange({
        ...value,
        region: newValue,
      });
    }
  };
  return (
    <div
      className="flex flex-col gap-4"
      data-testid="replication-step-container"
    >
      <div>
        <span
          className="text-sm leading-none font-medium"
          id="offsite-replication-radio"
        >
          {t('offsiteReplicationGroupLabel')}
        </span>
        <RadioGroup
          aria-labelledby="offsite-replication-radio"
          value={
            value.enabled ? ReplicationMode.Enabled : ReplicationMode.Disabled
          }
          onValueChange={(newValue: string) => {
            onChange({
              region: value.region ?? regions[0].name,
              enabled: newValue === ReplicationMode.Enabled,
            });
          }}
          data-testid="offsite-replication-select-container"
          ref={ref}
        >
          {REPLICATION_MODES_OPTIONS.map((replicationMode) => (
            <div className="flex items-center gap-3" key={replicationMode}>
              <RadioGroupItem
                value={replicationMode}
                id={`offsite-replication-${replicationMode}-option`}
                data-testid={`offsite-replication-${replicationMode}-option`}
              />
              <Label
                htmlFor={`offsite-replication-${replicationMode}-option`}
                className="flex items-center gap-2"
              >
                {t(`offsiteReplicationLabel-${replicationMode}`)}
                {RECOMMENEDED_REPLICATION_MODE === replicationMode && (
                  <Badge variant="information">
                    {t('offsiteReplicationRecommended')}
                  </Badge>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {value.enabled && (
        <div>
          <span
            className="text-sm leading-none font-medium"
            id="offsite-replication-region-combobox"
          >
            {t('offsiteReplicationRegionLabel')}
          </span>
          <Combobox value={value.region} onValueChange={onSelectRegion}>
            <ComboboxTrigger>
              <ComboboxValue
                aria-labelledby="offsite-replication-region-combobox"
                placeholder={t('offsiteReplicationRegionPlaceholder')}
                value={<RegionWithFlag region={selectedRegion} />}
              />
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxInput
                placeholder={t('offsiteReplicationRegionSearchPlaceholder')}
              />
              <ComboboxList>
                <ComboboxEmpty>
                  {t('offsiteReplicationRegionhSearchNoResult')}
                </ComboboxEmpty>
                {continents.map((continent) => (
                  <ComboboxGroup key={continent} heading={continent}>
                    {mappedRegions
                      .filter((region) => region.continent === continent)
                      .map((r) => (
                        <ComboboxItem
                          keywords={[r.label, r.name]}
                          key={r.name}
                          value={r.name}
                          className="flex gap-2"
                        >
                          <RegionWithFlag region={r} />
                        </ComboboxItem>
                      ))}
                  </ComboboxGroup>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      )}

      {value.enabled && (
        <Alert variant="information">
          <AlertDescription className="flex gap-2 items-center">
            <Info className="size-4" />
            {t('offsiteReplicationVersioningAlert')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
});

OffsiteReplicationStep.displayName = 'OffsiteReplicationStep';
export default OffsiteReplicationStep;
