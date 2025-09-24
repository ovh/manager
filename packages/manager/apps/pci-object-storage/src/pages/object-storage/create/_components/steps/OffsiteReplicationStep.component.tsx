
import { Badge, RadioGroup, RadioGroupItem, Label, Select, Popover, PopoverTrigger, Button, PopoverContent, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Command, Alert, AlertDescription } from "@datatr-ux/uxlib";
import React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MappedRegions } from "./RegionStep.component";
import { useTranslatedMicroRegions } from "@/hooks/useTranslatedMicroRegions";
import { useTranslation } from "react-i18next";
import Flag from "@/components/flag/Flag.component";
import { Region } from "@datatr-ux/ovhcloud-types/cloud/index";


enum ReplicationMode {
  Disabled = "disabled",
  Enabled = "enabled",
}

enum RegionSelectionMode {
  Automatic = "automatic",
  Manual = "manual",
}


type OffsiteReplicationValue = {
  enabled?: boolean;
  automaticRegionSelection?: boolean;
  region?: string;
}
interface OffsiteReplicationStepProps {
  regions: Region[];
  value?: OffsiteReplicationValue;
  onChange?: (newValue: OffsiteReplicationValue) => void;
}
const OffsiteReplicationStep = React.forwardRef<HTMLInputElement, OffsiteReplicationStepProps>(
  ({ value, onChange, regions }, ref) => {

    const [open, setOpen] = React.useState(false)
    const {
      translateContinentRegion,
      translateMicroRegion
    } = useTranslatedMicroRegions();

    const mappedRegions: MappedRegions[] = regions.map((r) => ({
      label: translateMicroRegion(r.name),
      continent: translateContinentRegion(r.name),
      ...r,
    }));
    const continents = [
      ...new Set([
        ...mappedRegions.map((mr) => mr.continent).toSorted(),
      ]),
    ];
    const selectedRegion = mappedRegions.find((r) => r.name === value.region);

    return (
      <div className="flex flex-col gap-4">
        <RadioGroup
          value={value.enabled ? ReplicationMode.Enabled : ReplicationMode.Disabled}
          onValueChange={(newValue: string) => {
            onChange({
              ...value,
              enabled: newValue === ReplicationMode.Enabled,
            })
          }}
          data-testid="offsite-replication-select-container"
          ref={ref}>
          <div className="flex items-center gap-3">
            <RadioGroupItem value={ReplicationMode.Disabled} id="offsite-replication-disabled-option" />
            <Label htmlFor="offsite-replication-disabled-option">Désactiver</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value={ReplicationMode.Enabled} id="offsite-replication-enabled-option" />
            <Label htmlFor="offsite-replication-enabled-option">Activer <Badge variant={'info'}>Recommandée</Badge></Label>
          </div>
        </RadioGroup>

        {value.enabled && (
          <div>
            <Label htmlFor="automatic-region-replication-radio">Sélection de la région de destination</Label>
            <RadioGroup
              id="automatic-region-replication-radio"
              value={value.automaticRegionSelection ? RegionSelectionMode.Automatic : RegionSelectionMode.Manual}
              onValueChange={(newValue: string) => {
                onChange({
                  ...value,
                  automaticRegionSelection: newValue === RegionSelectionMode.Automatic,
                })
              }}
              data-testid="automatic-region-replication-select-container"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={RegionSelectionMode.Automatic} id="automatic-region-replication-option" />
                <Label htmlFor="automatic-region-replication-option">Automatique</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value={RegionSelectionMode.Manual} id="manual-region-replication-option" />
                <Label htmlFor="manual-region-replication-option">Manuelle</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {value.automaticRegionSelection === false && (
          <div>
            <Label htmlFor="offsite-replication-region-combobox">Sélectionner une localisation</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="offsite-replication-region-combobox"
                  role="combobox"
                  aria-expanded={open}
                  className="text-text border border-input bg-background h-10 w-full rounded-md px-3 py-2 text-sm justify-between hover:bg-background active:bg-background"
                >
                  {value.region
                    ?
                    <div className="flex gap-2 items-center">
                      <Flag flagName={selectedRegion.countryCode} />
                      <span>{selectedRegion.label}</span>
                    </div>
                    : "Select region..."}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                <Command>
                  <CommandInput placeholder="Search region..." />
                  <CommandList>
                    <CommandEmpty>No region found.</CommandEmpty>
                    {continents.map((continent) => (
                      <CommandGroup
                        key={continent}
                        heading={continent}
                      >
                        {mappedRegions.filter(region => region.continent === continent)
                          .map((r) => (
                            <CommandItem
                              key={r.name}
                              value={r.label}
                              onSelect={(newValue) => {
                                const newRegion = mappedRegions.find(r => r.label === newValue)
                                setOpen(false)
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
            <AlertDescription>En activant l’Offsite Replication, le versioning s’active également.</AlertDescription>
          </Alert>
        )}
      </div>
    );
  },
);


OffsiteReplicationStep.displayName = 'OffsiteReplicationStep';
export default OffsiteReplicationStep;