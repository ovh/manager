import {
  Badge,
  RadioGroup,
  RadioGroupItem,
  Label,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
  Alert,
  AlertDescription,
} from '@datatr-ux/uxlib';
import React from 'react';
import { ChevronsUpDownIcon } from 'lucide-react';
import { Region } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useTranslation } from 'react-i18next';
import { MappedRegions } from './RegionStep.component';
import { useTranslatedMicroRegions } from '@/hooks/useTranslatedMicroRegions';
import Flag from '@/components/flag/Flag.component';

enum ReplicationMode {
  Disabled = 'disabled',
  Enabled = 'enabled',
}

enum RegionSelectionMode {
  Automatic = 'automatic',
  Manual = 'manual',
}

type OffsiteReplicationValue = {
  enabled?: boolean;
  automaticRegionSelection?: boolean;
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
  const [open, setOpen] = React.useState(false);
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

  const REGION_SELECTION_MODES_OPTIONS: RegionSelectionMode[] = [
    RegionSelectionMode.Automatic,
    RegionSelectionMode.Manual,
  ];

  return (
    <div className="flex flex-col gap-4">
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
              ...value,
              enabled: newValue === ReplicationMode.Enabled,
            });
          }}
          data-testid="offsite-replication-select-container"
          ref={ref}
        >
          {REPLICATION_MODES_OPTIONS.map((replicationMode) => (
            <div className="flex items-center gap-3">
              <RadioGroupItem
                value={replicationMode}
                id={`offsite-replication-${replicationMode}-option`}
              />
              <Label
                htmlFor={`offsite-replication-${replicationMode}-option`}
                className="flex items-center gap-2"
              >
                {t(`offsiteReplicationLabel-${replicationMode}`)}
                {RECOMMENEDED_REPLICATION_MODE === replicationMode && (
                  <Badge variant={'info'}>
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
            id="offsite-replication-radio"
          >
            {t('offsiteReplicationAutomaticRegionGroupLabel')}
          </span>
          <RadioGroup
            aria-labelledby="automatic-region-replication-radio"
            value={
              value.automaticRegionSelection
                ? RegionSelectionMode.Automatic
                : RegionSelectionMode.Manual
            }
            onValueChange={(newValue: string) => {
              onChange({
                ...value,
                automaticRegionSelection:
                  newValue === RegionSelectionMode.Automatic,
              });
            }}
            data-testid="automatic-region-replication-select-container"
          >
            {REGION_SELECTION_MODES_OPTIONS.map((regionMode) => (
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value={regionMode}
                  id={`${regionMode}-region-replication-option`}
                />
                <Label htmlFor={`${regionMode}-region-replication-option`}>
                  {t(`offsiteReplicationAutomaticRegion-${regionMode}`)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {value.automaticRegionSelection === false && (
        <div>
          <span
            className="text-sm leading-none font-medium"
            id="offsite-replication-region-combobox"
          >
            {t('offsiteReplicationRegionLabel')}
          </span>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                aria-labelledby="offsite-replication-region-combobox"
                role="combobox"
                aria-expanded={open}
                className="text-text border border-input bg-background h-10 w-full rounded-md px-3 py-2 text-sm justify-between hover:bg-background active:bg-background"
              >
                {value.region ? (
                  <div className="flex gap-2 items-center">
                    <Flag flagName={selectedRegion.countryCode} />
                    <span>{selectedRegion.label}</span>
                  </div>
                ) : (
                  t('offsiteReplicationRegionPlaceholder')
                )}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
              <Command>
                <CommandInput
                  placeholder={t('offsiteReplicationRegionSearchPlaceholder')}
                />
                <CommandList>
                  <CommandEmpty>
                    {t('offsiteReplicationRegionhSearchNoResult')}
                  </CommandEmpty>
                  {continents.map((continent) => (
                    <CommandGroup key={continent} heading={continent}>
                      {mappedRegions
                        .filter((region) => region.continent === continent)
                        .map((r) => (
                          <CommandItem
                            key={r.name}
                            value={r.label}
                            onSelect={(newValue) => {
                              const newRegion = mappedRegions.find(
                                (re) => re.label === newValue,
                              );
                              setOpen(false);
                              if (newRegion.name !== value.region) {
                                onChange({
                                  ...value,
                                  region: newRegion.name,
                                });
                              }
                            }}
                            className="flex gap-2"
                          >
                            <Flag flagName={r.countryCode} />
                            {r.label}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
      {value.enabled && (
        <Alert>
          <AlertDescription>
            {t('offsiteReplicationVersioningAlert')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
});

OffsiteReplicationStep.displayName = 'OffsiteReplicationStep';
export default OffsiteReplicationStep;
