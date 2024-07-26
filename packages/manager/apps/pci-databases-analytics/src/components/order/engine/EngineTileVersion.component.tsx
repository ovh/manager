import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Version } from '@/types/orderFunnel';
import { getTagVariant } from '@/lib/tagsHelper';
import { cn } from '@/lib/utils';

interface VersionSelectorProps {
  versions: Version[];
  selectedVersion: string;
  isEngineSelected: boolean;
  onChange: (version: string) => void;
}
const VersionSelector = ({
  versions,
  selectedVersion,
  isEngineSelected,
  onChange,
}: VersionSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('pci-databases-analytics/components/engine');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div data-testid="engine-tile-version-container" className="hidden">
        {versions.map((engineVersion) => (
          <input
            data-testid={`engine-tile-version-input-${engineVersion.name}`}
            type="radio"
            name="version-select"
            value={engineVersion.name}
            key={engineVersion.name}
            readOnly
            checked={isEngineSelected && engineVersion.name === selectedVersion}
          />
        ))}
      </div>
      <PopoverTrigger asChild>
        <Button
          data-testid="popover-trigger-button"
          disabled={versions.length === 1}
          variant="outline"
          size="sm"
          className="rounded-none justify-start w-full border border-[#bef1ff] font-normal text-[#4d5592] "
        >
          {selectedVersion && (
            <div className="flex flex-row w-full justify-between overflow-hidden">
              {selectedVersion}
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="end">
        <Command>
          <CommandInput placeholder={t('selectAVersion')} />
          <CommandList>
            <CommandEmpty>{t('noVersionFound')}</CommandEmpty>
            <CommandGroup>
              {versions.map((engineVersion) => (
                <CommandItem
                  key={engineVersion.name}
                  value={engineVersion.name}
                  onSelect={(value) => {
                    onChange(value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      engineVersion.name === selectedVersion
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  <div className="flex flex-row justify-between w-full cursor-pointer overflow-hidden">
                    <span>{engineVersion.name}</span>
                    <div className="ml-2 flex gap-1">
                      {engineVersion.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={getTagVariant(tag)}
                          className="text-xs h-4"
                        >
                          {t(`versionTag-${tag}`, tag)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default VersionSelector;
