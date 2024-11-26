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
import { cn } from '@/lib/utils';

interface VersionSelectorProps {
  versions: string[];
  selectedVersion: string;
  isFrameworkSelected: boolean;
  onChange: (version: string) => void;
}
const VersionSelector = ({
  versions,
  selectedVersion,
  isFrameworkSelected,
  onChange,
}: VersionSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('pci-ai-notebooks/components/framework');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="hidden">
        {versions.map((fmkVersion) => (
          <input
            type="radio"
            name="version-select"
            value={fmkVersion}
            key={fmkVersion}
            readOnly
            checked={isFrameworkSelected && fmkVersion === selectedVersion}
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
              {versions.map((fmkVersion) => (
                <CommandItem
                  key={fmkVersion}
                  value={fmkVersion}
                  onSelect={(value) => {
                    onChange(value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      fmkVersion === selectedVersion
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  <span className="w-full cursor-pointer overflow-hidden">
                    {fmkVersion}
                  </span>
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
